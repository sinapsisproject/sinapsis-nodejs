import { questions_foro } from './../models/questions_foro.model.js';


const createPreguntaForo = async(req , res) => {

    const {entrada , id_usuario, nombre_usuario , id_foro} = req.body;

    try {
        
        const newPreguntaForo = await questions_foro.create({
            entrada,
            id_usuario,
            nombre_usuario,
            id_foro
        })

        res.json({
            "status" : true,
            "response" : newPreguntaForo
        });

    } catch (error) {
        res.json({
            "status" : false,
            "msg"    : 'Error al insertar nueva pregunta',
            "error"  : error
        })
    }
        
}

export const methods = {
    createPreguntaForo
}