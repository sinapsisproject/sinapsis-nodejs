import { text } from './../models/text.model.js';


const createText = async(req , res) => {

    const {nombre, texto , ubicacion, estado, id_modulo} = req.body;

    try {
        
        const newText = await text.create({
            nombre,
            texto,
            ubicacion,
            estado,
            id_modulo
        })

        res.json(newText);

    } catch (error) {
        res.json({
            "status" : false,
            "msg"    : 'Error al insertar nuevo apunte',
            "error"  : error
        })
    }
        
}

export const methods = {
    createText
}