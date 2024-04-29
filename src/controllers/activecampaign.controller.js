import { config } from 'dotenv';
import request from "request"

config();


const createContact = async(req , res) => {

    try {
        const {contact , dataList} =  req.body;


        request({method: 'POST' , url: req.url_base+'contacts' , headers: req.headers , body : JSON.stringify({contact})} , function (error, response, body) {
            if (error) throw new Error(error);

            const lista = {
                "contactList": {
                    "list": dataList.list,
                    "contact": parseInt(JSON.parse(body).contact.id),
                    "status": dataList.status
                }
            }

            request({method: 'POST' , url: req.url_base+'contactLists' , headers: req.headers , body : JSON.stringify(lista)} , function (error, response, body) {
                if (error) throw new Error(error);
              
                res.json({
                    "status" : true,
                    "response" : JSON.parse(body)
                })
            
              });

          });

    } catch (error) {
        res.json({
            "status" : false,
            "msg"    : 'Error en la consulta a activecampaign',
            "error"  : error
        })
    }

}




const getContact = async(req , res) => {
    
      request({method: 'GET' , url: req.url_base+'contacts' , headers: req.headers}, function (error, response, body) {
        if (error) throw new Error(error);
      
        res.json({
            "status" : true,
            "response" : JSON.parse(body)
        })
      });

}

export const methods = {
    getContact,
    createContact
}