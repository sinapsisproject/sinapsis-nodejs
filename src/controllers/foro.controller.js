import { foro } from './../models/foro.model.js';
import { questions_foro } from '../models/questions_foro.model.js';
import { response_foro } from '../models/response_foro.js';


const createForo = async(req , res) => {

    const {nombre, estado, descripcion, ubicacion, id_modulo} = req.body;

    try {
        
        const newForo = await foro.create({
            nombre,
            estado,
            descripcion,
            ubicacion,
            id_modulo
        })

        res.json(newForo);

    } catch (error) {
        res.json({
            "status" : false,
            "msg"    : 'Error al insertar nuevo foro',
            "error"  : error
        })
    }
        
}


const getForo = async(req , res) => {

    const { id } = req.params;

    try {
        
        const foro_res = await foro.findByPk( id , {
            include: [
                {
                    model : questions_foro,
                    include : [response_foro]
                }
            ]
        });
        res.json(foro_res);

    } catch (error) {
        res.json({
            "status" : false,
            "msg"    : 'Error al ejecutar la consulta',
            "error"  : error
        })
    }

}

export const methods = {
    createForo,
    getForo
}