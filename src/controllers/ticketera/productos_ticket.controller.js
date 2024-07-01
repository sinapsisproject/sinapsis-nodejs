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

import nodemailer from 'nodemailer';


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

    const { idUserType , idPacks , dataUser } = req.body;

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


        let dataCreateOrder = {
            "subtotal"  : total_pesos,
            "total"     : total_pesos,
            "total_dolares" : total_pesos / 1000,
            "estado" : "pending",
            "descuento" : 0,
            "fecha" : dataUser.fecha,
            "medio_pago" : "",
            "plataforma_pago" : dataUser.plataforma_pago,
            "id_usuario" : dataUser.id_usuario,
            "id_tipo_usuario" : idUserType,
            "id_usuario_sinapsis" : dataUser.id_usuario_sinapsis
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

    const {  } = req.body;


    const transporter = nodemailer.createTransport({
        service: 'gmail', // Puedes usar otros servicios como Yahoo, Outlook, etc.
        auth: {
            user: 'contacto@sinapsisclinica.com', // Tu correo electrónico
            pass: 'bevc zfqq hhly xtkh' // Tu contraseña
        }
    });

    const mailOptions = {
        from: 'contacto@sinapsisclinica.com', // Dirección del remitente
        to: 'diego.icinf@gmail.com', // Dirección del destinatario
        subject: 'Asunto del correo', // Asunto del correo
        text: 'Contenido del correo en texto plano', // Cuerpo del correo en texto plano
        html: '<img width="160" height="40" src="https://sinapsisclinica.com/wp-content/uploads/2023/09/Diseno-sin-titulo-1.png" class="attachment-large size-large wp-image-3372">' // Cuerpo del correo en HTML (opcional)
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Correo enviado: ' + info.response);
    });


    res.json({
        "status"        : true,
        "response"      : "hola"
     });

}


export const methods = {
    getDataByTypeUser,
    getTypeUserTicket,
    createOrderProducts,
    registerUserTickets,
    getOrderById,
    getUserTicketById,
    sendMailUserTicket
}