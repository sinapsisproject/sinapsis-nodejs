import { tipo_usuario_ticket } from "../../models/ticketera/tipo_usuario.model.js";
import { caracteristica } from "../../models/ticketera/caracteristica.model.js";
import { tipo_producto_ticket } from "../../models/ticketera/tipo_producto.model.js";
import { pack } from "../../models/ticketera/pack.model.js";
import { precio } from "../../models/ticketera/precio.model.js";
import { unidades } from "../../models/ticketera/unidades.model.js";
import { producto_ticket } from "../../models/ticketera/producto.model.js"; 
import { tipo_precio } from "../../models/ticketera/tipo_precio.model.js";
import { response } from "express";
import { usuarios_ticket } from "../../models/ticketera/usuarios_ticket.model.js";
import { orden_ticket } from "../../models/ticketera/orden_ticket.model.js";
import { item_ticket } from "../../models/ticketera/item_ticket.model.js";
import { user } from "../../models/user.model.js";

import nodemailer from 'nodemailer';
import { Op } from 'sequelize';
import path from 'path';
import fs  from 'fs';
import { fileURLToPath } from 'url';
import { codigo_descuento } from "../../models/ticketera/codigos_descuento.model.js";
import bcryptjs from 'bcryptjs';

const getDataByTypeUser = async(req , res) => {

    const { id } = req.params;

    const response = await tipo_usuario_ticket.findByPk(id, {
        attributes: ['id', 'nombre', 'estado'],
        include: [
            {
                model: caracteristica,
                as: 'car',
                attributes: ['id', 'cant_curso_online', 'cant_curso_presencial'],
                include: [
                    {
                        model: tipo_producto_ticket,
                        as: 'tpt',
                        attributes: ['id', 'nombre', 'estado'],
                        include: [
                            {
                                model: pack,
                                as: 'pa',
                                where: {
                                    id_tipo_usuario: id
                                },
                                attributes: ["id"],
                                include: [
                                    {
                                        model: unidades,
                                        as: 'ud',
                                        attributes: ['id_producto'],
                                        include: [
                                            {
                                                model: producto_ticket,
                                                as: 'pt',
                                                attributes: ['id', 'nombre', 'estado'],
                                                include : [
                                                    {
                                                        model: precio,
                                                        as: 'pre',
                                                        where: {
                                                            id_tipo_usuario: id
                                                        },
                                                        attributes: ['valor'],
                                                        include: [
                                                            {
                                                                model : tipo_precio,
                                                                as: 'tpre',
                                                                attributes: ['nombre_precio' , 'estado']
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        order: [
            // Ordenar por un atributo de tipo_usuario_ticket
            ['id', 'ASC'], // Ordenar por nombre en orden ascendente
    
            // Ordenar por un atributo de producto_ticket
            [{ model: caracteristica, as: 'car' }, 
             { model: tipo_producto_ticket, as: 'tpt' },
             { model: pack, as: 'pa' },
             { model: unidades, as: 'ud' },
             { model: producto_ticket, as: 'pt' }, 'id', 'ASC'] // Ordenar por nombre en orden ascendente de producto_ticket
        ]
    });
    

    //console.log(JSON.stringify(response, null, 2));
    res.json(response)

}



const getTypeUserTicket = async(req , res) => {

    const response = await tipo_usuario_ticket.findAll({
        attributes: ['id', 'nombre', 'estado']
    });
    res.json(response)
}


const createOrderProducts = async(req , res) => {

    const { idUserType , idPacks , dataUser , promo_code} = req.body;

    const response = [];

    if(idUserType === null || idUserType === undefined || idUserType === '' || idPacks.length === 0){
        res.json({
            "status" : false,
            "msg" : "Error en paramentros de entrada"
        })
    }else{

        
        await Promise.all(
            idPacks.map(async (id_pack) => {

                const valores = await pack.findByPk(id_pack, {
                    where : {
                        id_tipo_usuario: idUserType
                    },
                    attributes: ["id"],
                    include : [
                        {
                            model: unidades,
                            as : "ud",
                            attributes: ["id" , "id_producto"],
                            include : [
                                {
                                    model : producto_ticket,
                                    as : "pt",
                                    attributes: ["nombre" , "estado"],
                                    include : [
                                        {
                                            model : precio,
                                            where : {
                                                id_tipo_usuario : idUserType
                                            },
                                            as : "pre",
                                            attributes: ["valor"],
                                            include : [{
                                                model : tipo_precio,
                                                where : {
                                                    estado: "activo"
                                                },
                                                as : "tpre",
                                                attributes : ["nombre_precio", "estado"]
                                            }]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                })

                response.push(valores);

            })
        )

        const data = JSON.parse(JSON.stringify(response, null, 2));

        let total_pesos = 0;
        let product_price = [];
        await Promise.all(
            data.map(async (value) => {

                    await Promise.all(
                        value.ud.map(async (prod) => {
                            product_price.push(
                                {
                                    "id_producto" : prod.id_producto,
                                    "producto" : prod.pt.nombre,
                                    "precio" : prod.pt.pre[0].valor,
                                    "tipo_precio" : prod.pt.pre[0].tpre.nombre_precio,
                                }
                            )

                            total_pesos = total_pesos + prod.pt.pre[0].valor;

                        })
                    )

            })
        )


        //PROMO CODE VALIDATION

        let data_promo_code = [{"descuento" : 0 , "id_codigo_descuento" : null}];
        if(promo_code != "" & promo_code != "undefined" ){

            const res_promo_code = await codigo_descuento.findAll({
                where : {
                    codigo : promo_code,
                    unidades : {
                        [Op.gt] : 0
                    }
                },
                attributes: ['id' , 'descuento', 'unidades']
            });

            data_promo_code = JSON.parse(JSON.stringify(res_promo_code, null, 2));

            if(data_promo_code.length == 1){
                
                codigo_descuento.update(
                    {
                        unidades : parseInt(data_promo_code[0].unidades) - 1
                    },
                    {
                        where : {
                            id : data_promo_code[0].id
                        }
                    }
                    ).then((result) => {
                        console.log(result);
                    })
            }else{
                data_promo_code = [{"descuento" : 0 , "id_codigo_descuento" : null}];
            }

        }

        // console.log("///////////////////////////////////////////////////////////");
        // console.log(data_promo_code[0]);
        // console.log("///////////////////////////////////////////////////////////");


        let dataCreateOrder = {
            "subtotal"  : total_pesos,
            "total"     : total_pesos,
            "total_dolares" : total_pesos / 1000,
            "estado" : "pending",
            "fecha" : dataUser.fecha,
            "medio_pago" : "",
            "plataforma_pago" : dataUser.plataforma_pago,
            "id_usuario" : dataUser.id_usuario,
            "id_tipo_usuario" : idUserType,
            "id_usuario_sinapsis" : dataUser.id_usuario_sinapsis,
            "descuento" : data_promo_code[0].descuento,
            "id_codigo_descuento": data_promo_code[0].id
        }


        orden_ticket.create(dataCreateOrder)
        .then(async order => {
            

            await Promise.all(
                product_price.map(async (prod) => {

                    let itemData = {
                        "cantidad" : 1,
                        "id_producto" : prod.id_producto,
                        "nombre_producto" : prod.producto,
                        "precio" : prod.precio,
                        "id_orden_ticket" : order.id
                    }

                    item_ticket.create(itemData)
                    .then(item => {
                        
                       console.log(item);
                
                    })
                    .catch(err => {
                        res.json({
                            "status"        : false,
                            "error"         : err,
                         });
                    });

                })
            )

            res.json({
                "status"        : true,
                "response"      : order,
             });
    
        })
        .catch(err => {
            res.json({
                "status"        : false,
                "error"         : err,
             });
        });
       
    }


}


const registerUserTickets = async(req , res) => {

    const datosUsuario = req.body;

    usuarios_ticket.create(datosUsuario)
    .then(usuario => {
        
        res.json({
            "status"        : true,
            "response"      : usuario,
         });

    })
    .catch(err => {
        res.json({
            "status"        : false,
            "error"         : err,
         });
    });

}

const getOrderById = async(req , res) => {

    const { id } = req.params;

    try {
        
        const order = await orden_ticket.findByPk(id, {
            include : [
                {
                    model : item_ticket,
                    as : "it",
                }
            ]
        })
    
        if(order == null){
            res.json({
                "status"        : false,
                "error"         : "Orden no encontrada"
             });
        }else{
            res.json({
                "status"        : true,
                "response"      : order
             });
        }
        

    } catch (error) {
        
        res.json({
            "status"        : false,
            "error"      : error
         });

    }

}


const getUserTicketById = async(req , res) => {
    
    const { id } = req.params;

    try {
        
        const order = await usuarios_ticket.findByPk(id);

        res.json({
            "status"        : true,
            "response"      : order
         });

    } catch (error) {
        res.json({
            "status"        : false,
            "error"      : error
         });
    }
}

const sendMailUserTicket = async(req , res) => {

    const { mail } = req.body;

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const htmlPath = path.join(__dirname, 'assets', 'templates', 'mail_pay.html');

    fs.readFile(htmlPath, 'utf8', (err, html) => {
        if (err) {
            return res.status(500).send('Error al leer el archivo HTML');
        }else{
            const transporter = nodemailer.createTransport({
                service: 'gmail', // Puedes usar otros servicios como Yahoo, Outlook, etc.
                auth: {
                    user: 'contacto@sinapsisclinica.com', // Tu correo electrónico
                    pass: process.env.CLAVE_APP_GMAIL // Tu contraseña
                }
            });

            const mailOptions = {
                from: 'contacto@sinapsisclinica.com', // Dirección del remitente
                to: mail, // Dirección del destinatario
                subject: '¡Felicitaciones! Ya estás inscrito en el curso de Endocrinología y Diabetología Hospitalaria', // Asunto del correo
                //text: 'Contenido del correo en texto plano', // Cuerpo del correo en texto plano
                html: html 
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Correo enviado: ' + info.response);
                res.json({
                    "status"        : true,
                    "response"      : "Correo enviado"
                 });
            });

        }
    });


}


const validarCodigoDescuento = async(req , res) => {

    const { codigo } = req.params;

    const response = await codigo_descuento.findAll({
        where : {
            codigo : codigo
        },
        attributes: ['codigo', 'descuento', 'unidades']
    });

    const data = JSON.parse(JSON.stringify(response, null, 2));

    if(data.length == 1){
        res.json({
            "status" : true,
            "response" : response[0]
        });
    }else if(data.length == 0){
        res.json({
            "status" : false,
            "error" : "El código no existe."
        });
    }else if(data.length > 1){
        res.json({
            "status" : false,
            "error" : "El código está repetido, contactar con soporte."
        });
    } 

}

const loginUserTicket = async(req , res) => {
    
    const { email , pass } = req.body;

    try {
        
        const response_user = await user.findAll({
            where: {
                username: email
            }
        });

        if(response_user.length > 0){

            const validPassword =  bcryptjs.compareSync(pass, response_user[0].password);

            if(validPassword){

                const response_user_ticket = await usuarios_ticket.findAll({
                    where: {
                       correo_electronico : email
                    }
                });

                res.json({
                    "status" : true,
                    "response_user_ticket" : response_user_ticket,
                    "response_user" : response_user
                });

            }else{
                res.json({
                    "status" : false,
                    "msg" : "Constraseña incorrecta"
                });
            }

        }
       

    } catch (error) {
        res.json({
            "status"        : false,
            "error"      : error
         });
    }
}


export const methods = {
    getDataByTypeUser,
    getTypeUserTicket,
    createOrderProducts,
    registerUserTickets,
    getOrderById,
    getUserTicketById,
    sendMailUserTicket,
    validarCodigoDescuento,
    loginUserTicket
}