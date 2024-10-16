import paypal from 'paypal-rest-sdk';
import { config } from 'dotenv';
import pkg from 'transbank-sdk';
const {WebpayPlus} = pkg;
import ejs from 'ejs';
import nodemailer from 'nodemailer';


import path from 'path';
import fs  from 'fs';
import { fileURLToPath } from 'url';

import { order } from '../models/orders.model.js';
import { course } from '../models/course.model.js';
import { user_course } from '../models/user_course.model.js';
import { user } from '../models/user.model.js';

const createTransaction = async(req , res)=>{

  const id_usuario = req.usuario.uid;

  const {id_curso , fecha, id_order} = req.body;

  const returnUrl = process.env.PROTOCOL+"://" + req.get("host") + "/api/pay/validate?id_orden="+id_order+"&id_curso="+id_curso;

  const curso = await course.findByPk(id_curso);

  try {

    const createResponse = await (new WebpayPlus.Transaction()).create(
      "O-" +id_order,
      "S-" +id_usuario,
      curso.precio,
      returnUrl
    );
    
    console.log("CREAR TRANSACCION");
    console.log(createResponse);

    if(createResponse.token && createResponse.url){

      const viewData  = {
        "id_usuario"  : id_usuario,
        "id_curso"    : id_curso,
        "fecha"       : fecha,
        "total"       : curso.precio,
        "token"       : createResponse.token,
        "url"         : createResponse.url
      }

      res.json({
        "status" : true,
        "response" : viewData
      });
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


const validateTransaction = async(req , res)=>{

  let params = req.method === 'GET' ? req.query : req.body;

  let token = params.token_ws;
  let tbkToken = params.TBK_TOKEN;
  let tbkOrdenCompra = params.TBK_ORDEN_COMPRA;
  let tbkIdSesion = params.TBK_ID_SESION;

  let id_curso = req.query.id_curso;
  let id_orden = req.query.id_orden;

  console.log(id_curso);
  console.log(id_orden);


  // console.log("TOKEN: "+token);
  // console.log("TBK_TOKEN: "+tbkToken);
  // console.log("TBK_ORDEN_COMPRA: "+tbkOrdenCompra);
  // console.log("TBK_ID_SESION: "+tbkIdSesion);


  if (token && !tbkToken) {//Primer caso (exitoso)
    const commitResponse = await (new WebpayPlus.Transaction()).commit(token);

    if(commitResponse.response_code == 0){

      let splitOrder = commitResponse.buy_order.split('-');
      let order_number = parseInt(splitOrder[1]);

      let splitUserSession = commitResponse.session_id.split('-');
      let id_usuario = parseInt(splitUserSession[1]);

      const details_order = await order.findAll({ 
        where: {
            id: order_number
        }
      });

      const curso_comprado = await course.findByPk(details_order[0].dataValues.id_curso);

      const user_join_course = await user_course.create({ //asociamos el curso al usuario
        estado : "activo",
        id_usuario : id_usuario,
        id_curso : curso_comprado.dataValues.id
      });

      if(user_join_course){

        order.update( //agregamos el estado de completado a la orden
        {
          estado : "completado",
          total : curso_comprado.dataValues.precio,
          moneda : "CLP"
        },
        {
          where : {
            id: order_number
          }
        }
        ).then(async (result) => {
          
          const dataUser = await user.findByPk(id_usuario);
          const dataCourse = await course.findByPk(id_curso);

          res.redirect(process.env.DOMAIN_SITE+'/pago-ok/?order='+id_orden+'&id_curso='+id_curso+'&motor=webpay');

            /* ENVIO DE CORREO ELECTRÓNICO */

          let nombre_curso = dataCourse.nombre
       
          const __filename = fileURLToPath(import.meta.url);
          const __dirname = path.dirname(__filename);

          const htmlPath = path.join(__dirname, 'ticketera' , 'assets', 'templates', 'mail_paypal.ejs');

          ejs.renderFile(htmlPath, { nombre_curso }, (err, html) => {
            if (err) {
                return res.status(500).send('Error al leer el archivo HTML');
            }else{
                const transporter = nodemailer.createTransport({
                    service: 'gmail', // Puedes usar otros servicios como Yahoo, Outlook, etc.
                    auth: {
                        user: 'contacto@sinapsisclinica.com', // Tu correo electrónico
                        pass: 'wahf wwwn pkqq ydbj' // Tu contraseña
                    }
                });
    
                const mailOptions = {
                    from: 'contacto@sinapsisclinica.com', // Dirección del remitente
                    to:  [dataUser.email , "contacto@sinapsisclinica.com"], // Dirección del destinatario
                    subject: '¡Estás dentro! Accede a tu curso y empieza a aprender 🚀', // Asunto del correo
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


        })
        .catch((error) =>{
          res.redirect(process.env.DOMAIN_SITE+'/pago-error/?order='+id_orden+'&id_curso='+id_curso+'&motor=webpay');  
        });

      }else{
        res.redirect(process.env.DOMAIN_SITE+'/pago-error/?order='+id_orden+'&id_curso='+id_curso+'&motor=webpay'); 
      }

      
    }else{
      res.redirect(process.env.DOMAIN_SITE+'/pago-error/?order='+id_orden+'&id_curso='+id_curso+'&motor=webpay');
    }

  } else if (!token && !tbkToken) {//Segundo caso (El pago fue anulado por tiempo de espera)
    res.redirect(process.env.DOMAIN_SITE+'/pago-error/?order='+id_orden+'&id_curso='+id_curso+'&motor=webpay');
  } else if (!token && tbkToken) {//Tercer caso (El pago fue anulado por el usuario.)
    res.redirect(process.env.DOMAIN_SITE+'/pago-error/?order='+id_orden+'&id_curso='+id_curso+'&motor=webpay');
  } else if (token && tbkToken) {//Cuarto caso (El pago es inválido.)
    res.redirect(process.env.DOMAIN_SITE+'/pago-error/?order='+id_orden+'&id_curso='+id_curso+'&motor=webpay');
  }
    
  
}


const getDataPagoOkByOrder = async(req , res)=>{

    const { id } = req.params;

    try {

      const dataUser  = await order.findAll({
        where: {
            id : id
        },
        attributes : ["id" , "id_usuario" , "estado", "createdAt"],
        include : [
          {
            model: user,
            attributes: ["id" , "nombre" , "email"]
          }
        ]

      });


      const dataCurso  = await order.findAll({
        where: {
            id : id
        },
        attributes : ["id" , "id_curso" , "estado"],
        include : [
          {
            model: course,
            attributes: ["id" , "nombre" , "precio", "imagen"]
          }
        ]

      });

      let object = {};
      object.orden = dataUser[0].dataValues.id;
      object.fecha = dataUser[0].dataValues.createdAt;
      object.usuario = dataUser[0].dataValues.usuario.dataValues;
      object.curso = dataCurso[0].dataValues.curso.dataValues;


      res.json({
        "status" : true,
        "response" : object
      })

    } catch (error) {
       res.json({
            "status" : false,
            "msg"    : 'Error al ejecutar la consulta',
            "error"  : error
        })
    }

}

////////////////////////////// PAYPAL /////////////////////////////////////////////////////

const createTransactionPaypal = async(req , res)=>{

  let monto_dolares;

  const id_usuario = req.usuario.uid;

  //const returnUrl = process.env.PROTOCOL+"://" + req.get("host") + "/api/pay/validate";

  const {id_curso , fecha, id_order} = req.body;

  const curso = await course.findByPk(id_curso);

  monto_dolares = curso.precio / 1000;
 
  if(curso.precio){
    
    try {
      paypal.configure({
      'mode': process.env.ENTORNO_PAYPAL,
      'client_id': process.env.CLIENT_ID_PAYPAL,
      'client_secret': process.env.CLIENT_SECRET_PAYPAL
      });

      const create_payment_json = {
        "intent": "sale",
        "payer": {
          "payment_method": "paypal"
        },
        "redirect_urls": {
          "return_url": `${process.env.PROTOCOL+"://" + req.get("host") + "/api/pay/success_paypal"}?id_orden=${id_order}&id_usuario=${id_usuario}&id_curso=${id_curso}`,
          "cancel_url": `${process.env.PROTOCOL+"://" + req.get("host") + "/api/pay/cancel_paypal"}?id_orden=${id_order}&id_usuario=${id_usuario}&id_curso=${id_curso}`,
        },
        "transactions": [{
          "amount": {
            "currency": "USD",
            "total": monto_dolares
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

                  res.json({
                      "status"  : true,
                      "motor"   : "paypal",
                      "msg"     : 'Orden generada con éxito',
                      "url_redirect"    : payment.links[i].href
                  })
                }
            }
        }
      });


    } catch (error) {
      res.json({
        "status" : false,
        "msg"    : 'Error',
        "error"  : error
      })
    }

  }else{
    res.json({
      "status" : false,
      "msg" :  "No se encontró el precio del producto"
    })  
  }

}


const successPaypal = async(req , res)=>{
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
      const id_curso = req.query.id_curso;
      const token = req.query.token;
      const payid = payment.id;
      const cart = payment.cart;
      const country_code = payment.payer.payer_info.country_code;
      const action = 'success';

      console.log(cart);

      let dataUserCourse = {
        "estado" : "activo",
        "id_usuario" :id_usuario,
        "id_curso" : id_curso
      }

      try {
        const userCourse = user_course.create(dataUserCourse);

        const updated = order.update(
          {
            estado: "completado",
            moneda: payment.transactions[0].amount.currency,
            total : payment.transactions[0].amount.total
          }, 
          {
            where: { id: id_orden }
          }
        );

        const dataUser = await user.findByPk(id_usuario);
        const dataCourse = await course.findByPk(id_curso);

        res.redirect(process.env.DOMAIN_SITE+'/pago-ok/?order='+id_orden+'&id_curso='+id_curso+'&motor=paypal');


        /* ENVIO DE CORREO ELECTRÓNICO */

        let nombre_curso = dataCourse.nombre
       
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        const htmlPath = path.join(__dirname, 'ticketera' , 'assets', 'templates', 'mail_paypal.ejs');

        ejs.renderFile(htmlPath, { nombre_curso }, (err, html) => {
          if (err) {
              return res.status(500).send('Error al leer el archivo HTML');
          }else{
              const transporter = nodemailer.createTransport({
                  service: 'gmail', // Puedes usar otros servicios como Yahoo, Outlook, etc.
                  auth: {
                      user: 'contacto@sinapsisclinica.com', // Tu correo electrónico
                      pass: 'wahf wwwn pkqq ydbj' // Tu contraseña
                  }
              });
  
              const mailOptions = {
                  from: 'contacto@sinapsisclinica.com', // Dirección del remitente
                  to:  [dataUser.email , "contacto@sinapsisclinica.com"], // Dirección del destinatario
                  subject: '¡Estás dentro! Accede a tu curso y empieza a aprender 🚀', // Asunto del correo
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

      } catch (error) {
        console.error('Error al actualizar la orden:', error);
      }

    }
  });



}

const cancelPaypal = async(req , res)=>{

  const token = req.query.token;
  const id_orden = req.query.id_orden;
  const id_curso = req.query.id_curso;
  const id_usuario = req.query.id_usuario;
  const action = 'cancel';

  const updated = order.update({estado:'cancelled'}, {
    where: { id: id_orden }
  });

  res.redirect(process.env.DOMAIN_SITE+'/pago-error/?order='+id_orden+'&id_curso='+id_curso+'&motor=paypal');

}


////////////////////////////// PAYPAL /////////////////////////////////////////////////////


const createOrder = async(req , res)=>{

  const id_usuario = req.usuario.uid;
  const {id_curso , fecha} = req.body;

  const orderUser = await order.create({
    id_usuario,
    id_curso,
    estado : "pendiente",
    fecha
  });

  if(orderUser){
    res.json({
      "status"    : true,
      "response"  : orderUser
    })
  }else{
    res.json({
      "status"    : false,
      "msg"       : "Error al crear orden"
    })
  }
}






  export const methods = {
    createTransaction,
    validateTransaction,
    getDataPagoOkByOrder,
    createTransactionPaypal,
    successPaypal,
    cancelPaypal,
    createOrder
}