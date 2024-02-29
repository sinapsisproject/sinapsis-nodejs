import { note } from './../models/note.model.js';


const createNote = async(req , res) => {

    const {nombre, link_apunte , descripcion, ubicacion, estado, id_modulo} = req.body;

    try {
        
        const newVideo = await note.create({
            nombre,
            link_apunte,
            descripcion,
            ubicacion,
            estado,
            id_modulo
        })

        res.json(newVideo);

    } catch (error) {
        res.json({
            "status" : false,
            "msg"    : 'Error al insertar nuevo apunte',
            "error"  : error
        })
    }
        
}

export const methods = {
    createNote
}