import { paypalTransactionLog } from './../models/ticketera/paypal.model.js';
import { orden_ticket } from './../models/ticketera/orden_ticket.model.js';
import paypal from 'paypal-rest-sdk';
import { config } from 'dotenv';
import { item_ticket } from '../models/ticketera/item_ticket.model.js';
import { user_course } from '../models/user_course.model.js';

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
      monto = dataOrden[0]?.total_dolares;
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
                  "id_curso" : 1 //CAMBIAR
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