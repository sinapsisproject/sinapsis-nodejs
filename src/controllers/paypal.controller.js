import { paypalTransactionLog } from './../models/ticketera/paypal.model.js';
import { orden_ticket } from './../models/ticketera/orden_ticket.model.js';
import { usuarios_ticket } from './../models/ticketera/usuarios_ticket.model.js';
import paypal from 'paypal-rest-sdk';
import { config } from 'dotenv';
import { item_ticket } from '../models/ticketera/item_ticket.model.js';
import { user_course } from '../models/user_course.model.js';

import nodemailer from 'nodemailer';
import path from 'path';
import fs  from 'fs';
import { fileURLToPath } from 'url';


config();

const createOrder = async(req , res) => {
    const {id_usuario, id_orden} = req.body;
    let monto;

    if(!id_usuario && !id_orden){
        return res.json({
            "status" : false,
            "msg"    : 'Faltan datos'
        })
    }

    const dataOrden = await orden_ticket.findAll({
      where: {
          id : id_orden
      }
    });

    if(dataOrden[0]?.total_dolares){

      if(dataOrden[0]?.descuento != 0){
        let total_descuento = (dataOrden[0]?.total_dolares * dataOrden[0]?.descuento) / 100;
        monto = dataOrden[0]?.total_dolares - total_descuento;
      }else{
        monto = dataOrden[0]?.total_dolares;
      }

    }else{
      return res.json({
        "status" : false,
        "msg"    : 'No se encontró el precio para la orden'
      })
    }

    paypal.configure({
      'mode': process.env.ENTORNO_PAYPAL, // Cambia a 'live' para producción
      'client_id': process.env.CLIENT_ID_PAYPAL,
      'client_secret': process.env.CLIENT_SECRET_PAYPAL
    });

    try {
        const create_payment_json = {
            "intent": "sale",
            "payer": {
              "payment_method": "paypal"
            },
            "redirect_urls": {
              "return_url": `${process.env.PROTOCOL+"://" + req.get("host") + "/api/paypal/success"}?id_orden=${id_orden}&id_usuario=${id_usuario}`,
              "cancel_url": `${process.env.PROTOCOL+"://" + req.get("host") + "/api/paypal/cancel"}?id_orden=${id_orden}&id_usuario=${id_usuario}`,
            },
            "transactions": [{
              "amount": {
                "currency": "USD",
                "total": monto
              }
            }]
        };
    
        paypal.payment.create(create_payment_json, (error, payment) => {
            if (error) {
              return res.json({
                "status" : false,
                "msg"    : 'Error al generar la orden de pago',
                "error"  : error
              })
            } else {
                const payid = payment.id;
                const action = 'create';
                const token = req.query.token; 

                for(let i = 0;i < payment.links.length;i++){
                    if(payment.links[i].rel === 'approval_url'){
                      const url = new URL(payment.links[i].href);
                      const token = url.searchParams.get('token');
                      const newTrans = paypalTransactionLog.create({
                        action,
                        token,
                        id_usuario,
                        id_orden,
                        payid,
                        monto
                      })

                      res.json({
                          "status" : true,
                          "motor" : "paypal",
                          "msg"    : 'Orden generada con éxito',
                          "url_redirect"    : payment.links[i].href
                      })
                    }
                }
            }
        });
    } catch (error) {
        return res.json({
            "status" : false,
            "msg"    : 'Error al inciar la transacción',
            "error"  : error
        })
    }
        
}

const successPay = async(req , res) => {
  const payerid = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    "payer_id": payerid
  };

  paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
    if (error) {
      return res.json({
        "status" : false,
        "msg"    : 'Error al completar la transacción',
        "error"  : error
      })
    } else {
      console.log("Pago completado con éxito", payment);
      const id_orden = req.query.id_orden;
      const id_usuario = req.query.id_usuario;
      const token = req.query.token;
      const payid = payment.id;
      const cart = payment.cart;
      const country_code = payment.payer.payer_info.country_code;
      const action = 'success';

      const newTrans = paypalTransactionLog.create({
        action,
        token,
        id_orden,
        id_usuario,
        cart,
        payid,
        payerid,
        country_code
      })

      /*si el pago es exitoso actualizar el estado como "complete" en la tabla orden_ticket*/
      try {

        const orderData = await orden_ticket.findByPk(id_orden, {
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

        if(jsonDataOrder != null){
          let item = jsonDataOrder.it;
          let countItem = (item).length;
          if(countItem == 1){
              let dataUserCourse = {
                  "estado" : "activo",
                  "id_usuario" :jsonDataOrder.id_usuario_sinapsis,
                  "id_curso" : 13 //CAMBIAR
              }
              const userCourse = user_course.create(dataUserCourse);
          }
        }

       
        
        const updated = orden_ticket.update({estado:'complete'}, {
            where: { id: id_orden }
        });
      } catch (error) {
        console.error('Error al actualizar la orden:', error);
      }
      res.redirect(process.env.DOMAIN_SITE+'/ok-pago/?order='+id_orden);


      //** ENVÍO DE CORREO ELECTRÓNICO (ARREGLAR ESTA WEA) */

      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);

      const htmlPath = path.join(__dirname, 'ticketera' , 'assets', 'templates', 'mail_pay.html');

      fs.readFile(htmlPath, 'utf8', async(err, html) => {

          if (err) {
              return res.status(500).send('Error al leer el archivo HTML');
          }else{

            const dataUser = await usuarios_ticket.findByPk(id_usuario);

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
      
    }
  });
}

const cancelPay = async(req , res) => {
    const token = req.query.token;
    const id_orden = req.query.id_orden;
    const id_usuario = req.query.id_usuario;
    const action = 'cancel';

    const newTrans = paypalTransactionLog.create({
      action,
      id_orden,
      id_usuario,
      token
    })
    res.redirect(process.env.DOMAIN_SITE+'/pago-error/');
    //res.redirect(`${process.env.URL_NOK_PAYPAL}?orden=${id_orden}`);

    /*si el pago es exitoso actualizar el estado como "cancelled" en la tabla orden_ticket*/
    try {
      const updated = orden_ticket.update({estado:'cancelled'}, {
          where: { id: id_orden }
      });
    } catch (error) {
      console.error('Error al actualizar la orden:', error);
    }
}

export const methods = {
    createOrder,
    successPay,
    cancelPay
}