import { response_foro } from './../models/response_foro.js';


const createRespuestaForo = async(req , res) => {

    const {entrada , id_usuario, id_pregunta, nombre_usuario} = req.body;

    try {
        
        const newRespuestaForo = await response_foro.create({
            entrada,
            id_usuario,
            id_pregunta,
            nombre_usuario
        })

        res.json({
            "status" : true,
            "response" : newRespuestaForo
        });

    } catch (error) {
        res.json({
            "status" : false,
            "msg"    : 'Error al insertar nueva respuesta',
            "error"  : error
        })
    }
        
}

export const methods = {
    createRespuestaForo
}