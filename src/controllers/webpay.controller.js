import pkg from 'transbank-sdk';
import { orden_ticket } from '../models/ticketera/orden_ticket.model.js';
import { item_ticket } from '../models/ticketera/item_ticket.model.js';
import { user_course } from '../models/user_course.model.js';
import { usuarios_ticket } from '../models/ticketera/usuarios_ticket.model.js';
const {WebpayPlus} = pkg;

import nodemailer from 'nodemailer';
import path from 'path';
import fs  from 'fs';
import { fileURLToPath } from 'url';


const createTransactionTicket = async(req , res)=>{

    const { id_orden } = req.params;

    const response_orden_ticket = await orden_ticket.findByPk(id_orden);

    let total_price = response_orden_ticket.total;
    if(response_orden_ticket.descuento != 0){
        const total_descuento = (response_orden_ticket.total * response_orden_ticket.descuento) / 100;
        total_price     = response_orden_ticket.total - total_descuento;
    }else{
        total_price = response_orden_ticket.total;
    }
    
    const returnUrl = process.env.PROTOCOL+"://" + req.get("host") + "/api/webpay/validate_ticket";

    try {
        
        const createResponse = await (new WebpayPlus.Transaction()).create(
            "O-" +response_orden_ticket.id,
            "S-" +response_orden_ticket.id_usuario,
            total_price,
            returnUrl
          );

        console.log("CREAR TRANSACCION");
        console.log(createResponse);

        if(createResponse.token && createResponse.url){
            const viewData  = {
                "id_usuario"  : response_orden_ticket.id_usuario,
                "fecha"       : response_orden_ticket.fecha,
                "total"       : response_orden_ticket.total,
                "token"       : createResponse.token,
                "url"         : createResponse.url,
                "motor"       : "webpay",
                "status"      : true
              }

              res.json(viewData);

        }else{
            res.json({
                "status" : false,
                "msg" : "Ocurrio un error al crear la transacción"
              });
        }


    } catch (error) {
        res.json({
            "status" : false,
            "msg" : "Ocurrio un error al crear la transacción",
            "error" : error
          });
    }


}


const validateTransactionTicket = async(req , res)=>{

    let params = req.method === 'GET' ? req.query : req.body;

    let token = params.token_ws;
    let tbkToken = params.TBK_TOKEN;
    let tbkOrdenCompra = params.TBK_ORDEN_COMPRA;
    let tbkIdSesion = params.TBK_ID_SESION;

    console.log("TOKEN: "+token);
    console.log("TBK_TOKEN: "+tbkToken);
    console.log("TBK_ORDEN_COMPRA: "+tbkOrdenCompra);
    console.log("TBK_ID_SESION: "+tbkIdSesion);

    if (token && !tbkToken) {//Primer caso (exitoso)
        const commitResponse = await (new WebpayPlus.Transaction()).commit(token);

        if(commitResponse.response_code == 0){

            let splitOrder = commitResponse.buy_order.split('-');
            let order_number = parseInt(splitOrder[1]);

            //ASOCIAMOS EL CURSO AL USUARIO

            const orderData = await orden_ticket.findByPk(order_number, {
                include : [
                    {
                        model : item_ticket,
                        as : "it",
                        where : {
                            id_producto : 1
                        }
                    }
                ]
            })

    
            let jsonDataOrder = JSON.parse(JSON.stringify(orderData, null, 2));

            console.log(jsonDataOrder);

            if(jsonDataOrder != null){
                let item = jsonDataOrder.it;
                let countItem = (item).length;
                if(countItem == 1){
                    let dataUserCourse = {
                        "estado" : "activo",
                        "id_usuario" :jsonDataOrder.id_usuario_sinapsis,
                        "id_curso" : 13 //CURSO ENDROCRINOLOGIA
                    }
                    let userCourse = user_course.create(dataUserCourse);
                }
            }


            orden_ticket.update( //agregamos el estado de completado a la orden
            {
                estado : "complete"
            },
            {
                where : {
                id: order_number
                }
            }
            ).then((result) => {
                res.redirect(process.env.DOMAIN_SITE+'/ok-pago/?order='+order_number);

                 //** ENVÍO DE CORREO ELECTRÓNICO (ARREGLAR ESTA WEA) */

                    const __filename = fileURLToPath(import.meta.url);
                    const __dirname = path.dirname(__filename);

                    const htmlPath = path.join(__dirname, 'ticketera' , 'assets', 'templates', 'mail_pay.html');

                    fs.readFile(htmlPath, 'utf8', async(err, html) => {

                        if (err) {
                            return res.status(500).send('Error al leer el archivo HTML');
                        }else{

                            const dataUser = await usuarios_ticket.findByPk(orderData.id_usuario);

                            const transporter = nodemailer.createTransport({
                                service: 'gmail', // Puedes usar otros servicios como Yahoo, Outlook, etc.
                                auth: {
                                    user: 'contacto@sinapsisclinica.com', // Tu correo electrónico
                                    pass: 'bevc zfqq hhly xtkh' // Tu contraseña
                                }
                            });

                            const mailOptions = {
                                from: 'contacto@sinapsisclinica.com', // Dirección del remitente
                                to: dataUser.correo_electronico, // Dirección del destinatario
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

                    //** ENVÍO DE CORREO ELECTRÓNICO (ARREGLAR ESTA WEA) */
                


            })
            .catch((error) =>{
                res.redirect(process.env.DOMAIN_SITE+'/pago-error/');  
            });
        
        }
        else{
            res.redirect(process.env.DOMAIN_SITE+'/pago-error/');
        }

    
    } else if (!token && !tbkToken) {//Segundo caso (El pago fue anulado por tiempo de espera)
        res.redirect(process.env.DOMAIN_SITE+'/pago-error/');
    } else if (!token && tbkToken) {//Tercer caso (El pago fue anulado por el usuario.)
        res.redirect(process.env.DOMAIN_SITE+'/pago-error/');
    } else if (token && tbkToken) {//Cuarto caso (El pago es inválido.)
        res.redirect(process.env.DOMAIN_SITE+'/pago-error/');
    }

}


export const methods = {
    createTransactionTicket,
    validateTransactionTicket
}