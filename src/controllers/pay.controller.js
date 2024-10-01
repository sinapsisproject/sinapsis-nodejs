import pkg from 'transbank-sdk';
const {WebpayPlus} = pkg;
import paypal from 'paypal-rest-sdk';


import { order } from '../models/orders.model.js';
import { course } from '../models/course.model.js';
import { user_course } from '../models/user_course.model.js';
import { user } from '../models/user.model.js';


const createTransaction = async(req , res)=>{

  const id_usuario = req.usuario.uid;

  const returnUrl = process.env.PROTOCOL+"://" + req.get("host") + "/api/pay/validate";

  const {id_curso , fecha} = req.body;

  const orderUser = await order.create({
      id_usuario,
      id_curso,
      fecha
  });

  const curso = await course.findByPk(id_curso);

  try {

    const createResponse = await (new WebpayPlus.Transaction()).create(
      "O-" +orderUser.id,
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


  console.log("TOKEN: "+token);
  console.log("TBK_TOKEN: "+tbkToken);
  console.log("TBK_ORDEN_COMPRA: "+tbkOrdenCompra);
  console.log("TBK_ID_SESION: "+tbkIdSesion);


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
          total : curso_comprado.dataValues.precio
        },
        {
          where : {
            id: order_number
          }
        }
        ).then((result) => {
          res.redirect(process.env.DOMAIN_SITE+'/pago-ok/?order='+order_number);
        })
        .catch((error) =>{
          res.redirect(process.env.DOMAIN_SITE+'/pago-error/');  
        });

      }else{
        res.redirect(process.env.DOMAIN_SITE+'/pago-error/'); 
      }

      
    }else{
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




  export const methods = {
    createTransaction,
    validateTransaction,
    getDataPagoOkByOrder,
    createOrder,
    successPay,
    cancelPay
}