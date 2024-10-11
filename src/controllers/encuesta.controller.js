import { encuesta } from './../models/encuesta.model.js';
import { encuesta_pregunta } from '../models/encuesta_pregunta.model.js';
import { encuesta_alternativa } from '../models/encuesta_alternativa.model.js';
import { encuesta_respuesta } from '../models/encuesta_respuesta.model.js';


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
                [encuesta_pregunta, encuesta_alternativa ,'id' , 'DESC']
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


const insertResponseFormularios = async(req , res) => {

    const {respuestas} = req.body;
    const id_usuario = req.usuario.uid;

        // Verificar si ya existe al menos una respuesta para este usuario en la encuesta
        const existingRespuestas = await encuesta_respuesta.findAll({
            where: {
                id_usuario: id_usuario
            },
            include: [
                {
                    model: encuesta_alternativa,
                    include: [
                        {
                            model: encuesta_pregunta,
                            where: {
                                id_encuesta: req.body.id_encuesta // Filtrar por encuesta
                            }
                        }
                    ]
                }
            ]
        });
    
        // Si ya existe alguna respuesta para este usuario en esta encuesta, no hacer nada
        if (existingRespuestas.length > 0) {
            // Si no quieres devolver ningún mensaje, simplemente retorna y no hagas nada.
            return;
        }
    
    



    if(respuestas.length > 0){
        await Promise.all(
            respuestas.map(async (id_respuesta) => {


                const existingResponse = await encuesta_respuesta.findOne({
                    where: {
                        id_encuesta_alternativa: id_respuesta,
                        id_usuario: id_usuario
                    }
                });

                 // Si no existe, guardamos la nueva respuesta
                if(!existingResponse){
                    const response_enc = await encuesta_respuesta.create({
                        id_encuesta_alternativa : id_respuesta,
                        id_usuario
                    });
                }
                else{
                    console.log('la respuesta ya fue registrada para la alternativa ${id_respuesta} del usuario ${id_usuario}');
                }

                

            })
    );

        res.json({
            "status" : true,
            "response" : "Datos ingresados"
        })

    }else{
        res.json({
            "status" : false,
            "response" : "No hay respuestas"
        })
    }

}


export const methods = {
    getPreguntasByIdEncuesta,
    insertResponseFormularios
}