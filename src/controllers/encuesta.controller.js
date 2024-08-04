import { encuesta } from './../models/encuesta.model.js';
import { encuesta_pregunta } from '../models/encuesta_pregunta.model.js';
import { encuesta_alternativa } from '../models/encuesta_alternativa.model.js';


const getPreguntasByIdEncuesta = async(req , res) => {

    try {
        
        const { id } = req.params;

        const data =  await encuesta.findAll({
            where: {
                id : id
            },
            include: [
                {
                    model : encuesta_pregunta,
                    include : [
                        {
                            model: encuesta_alternativa
                        }
                    ]
                }
            ],
            order : [
                [encuesta_pregunta, encuesta_alternativa ,'id' , 'ASC']
            ]

        })

        res.json({
            "status" : true,
            "response" : data
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
    getPreguntasByIdEncuesta
}