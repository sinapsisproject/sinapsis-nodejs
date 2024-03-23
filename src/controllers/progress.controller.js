import { progress } from './../models/progress.model.js';


const createProgress = async(req , res) => {

    const {id_item , nombre_item, id_usuario} = req.body;

    try {
        
        const newProgress = await progress.create({
            id_item,
            nombre_item,
            id_usuario
        })

        res.json({
            "status" : true,
            "response" : newProgress
        });

    } catch (error) {
        res.json({
            "status" : false,
            "msg"    : 'Error al insertar nuevo progreso',
            "error"  : error
        })
    }
        
}

export const methods = {
    createProgress
}