import { video } from './../models/video.model.js';


const createVideo = async(req , res) => {

    const {nombre, link_video , descripcion, ubicacion, estado, id_modulo} = req.body;

    try {
        
        const newVideo = await video.create({
            nombre,
            link_video,
            descripcion,
            ubicacion,
            estado,
            id_modulo
        })

        res.json(newVideo);

    } catch (error) {
        res.json({
            "status" : false,
            "msg"    : 'Error al insertar nuevo video',
            "error"  : error
        })
    }
        
}

export const methods = {
    createVideo
}