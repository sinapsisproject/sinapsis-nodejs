import { config } from 'dotenv';
import request from "request"

config();


const createContact = async(req , res) => {

    try {
        const {contact , dataList} =  req.body;

        request({method: 'POST' , url: req.url_base+'contacts' , headers: req.headers , body : JSON.stringify({contact})} , function (error, response, body) {
            if (error) throw new Error(error);

            console.log(JSON.parse(body));

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


const sendMailTemplate = async(req, res) => {

    const {id_automatizacion , email , code} =  req.body;

    request(
        {
            method: 'POST',
            url: req.url_base+'contact/sync',
            headers: req.headers, 
            body : {
                contact: {
                    email: email
                }
            },
            json: true
        } , function (error, response, body) 
        {
            if (error) throw new Error(error);
      
            let contactID = body.contact.id;


            request(
                {
                    method: 'POST',
                    url: req.url_base+'fieldValues',
                    headers: req.headers,
                    body : {
                        fieldValue: {
                            contact: contactID,
                            field: 2, //id del campo code_recovery_pass
                            value: code
                        }
                    },
                    json: true
                },function (error, response, body) 
                {
                    if (error) throw new Error(error);
              

                    if(body.fieldValue.value == code){

                        request(
                        {
                            method: 'POST',
                            url: req.url_base+'contactAutomations',
                            headers: req.headers,
                            body : {
                                contactAutomation: {
                                    automation: id_automatizacion,
                                    contact: contactID
                                }
                            },
                            json: true
                        },function (error, response, body) 
                        {
                            if (error) throw new Error(error);
                            
                            console.log(body);


                            res.json({
                                "status" : true,
                                "response" : body
                            })
                    
                        });

                    }

                    
            
                });

        });


}


const listFields = async(req, res) => {

    request({method: 'GET' , url: req.url_base+'fields' , headers: req.headers}, function (error, response, body) {
        if (error) throw new Error(error);
      
        res.json({
            "status" : true,
            "response" : JSON.parse(body)
        })
      });

}

export const methods = {
    getContact,
    createContact,
    sendMailTemplate,
    listFields
}