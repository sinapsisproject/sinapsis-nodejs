import { response_questionary } from "../models/response_questionary.model.js";
import { alternative } from "../models/alternativa.model.js";
import { question } from "../models/question.model.js";


const createResponseQuestionary = async(req , res) => {

    const {id_alternativa , id_usuario} = req.body;

    try {
        
        const response_ques = await response_questionary.create({
            id_alternativa,
            id_usuario
        })

        res.json({
            "status" : true,
            "response" : response_ques
        });

    } catch (error) {
        res.json({
            "status" : false,
            "msg"    : 'Error al insertar nuevas respuestas',
            "error"  : error
        })
    }
        
}


const correctionAlternative = async(req , res) => {

    try {
        
        const {alternativas , id_test} = req.body;

        const correcion = [];
        const general = {};
    

        if(alternativas.length > 0){
            await Promise.all(
                alternativas.map(async (id_alternativa) => {
        
                    const response = await alternative.findAll({
                        where: {
                            id : id_alternativa
                        }
                    });
                    correcion.push(response[0]);
                })
            )
            general.correccion = correcion;
        }


        const justify = await question.findAll({
            where: {
                id_cuestionario: id_test
            }
        });
    
        
        general.justificacion = justify;
        
    
        res.json({
            "status" : true,
            "response" : general
        });
    

    } catch (error) {
        res.json({
            "status" : false,
            "error" : error
        });
    }


   

}


export const methods = {
    createResponseQuestionary,
    correctionAlternative
}