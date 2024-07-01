import pkg from 'transbank-sdk';
import { orden_ticket } from '../models/ticketera/orden_ticket.model.js';
import { item_ticket } from '../models/ticketera/item_ticket.model.js';
import { user_course } from '../models/user_course.model.js';
const {WebpayPlus} = pkg;


const createTransactionTicket = async(req , res)=>{

    const { id_orden } = req.params;

    const response_orden_ticket = await orden_ticket.findByPk(id_orden);

    const returnUrl = process.env.PROTOCOL+"://" + req.get("host") + "/api/webpay/validate_ticket";

    try {
        
        const createResponse = await (new WebpayPlus.Transaction()).create(
            "O-" +response_orden_ticket.id,
            "S-" +response_orden_ticket.id_usuario,
            response_orden_ticket.total,
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
                        "id_curso" : 1 //CAMBIAR
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