import { objective } from '../models/objectives.model.js';


const createobjective = async(req , res) => {

    const {texto, id_modulo} = req.body;

    try {
        
        const newObjective = await objective.create({
            texto,
            id_modulo
        })

        res.json(newObjective);

    } catch (error) {
        res.json({
            "status" : false,
            "msg"    : 'Error al insertar nuevo objetivo',
            "error"  : error
        })
    }
        
}

export const methods = {
    createobjective
}