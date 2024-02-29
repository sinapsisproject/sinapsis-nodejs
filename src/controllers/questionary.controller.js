import { questionary } from './../models/questionary.model.js';
import { question } from '../models/question.model.js';
import { alternative } from '../models/alternativa.model.js';

const createQuestionary = async(req , res) => {

    const {titulo, descripcion , estado, aprovacion, tiempo, ubicacion, id_modulo} = req.body;

    try {
        
        const newQuestionary = await questionary.create({
            titulo,
            descripcion,
            estado,
            aprovacion,
            tiempo,
            ubicacion,
            id_modulo
        })

        res.json(newQuestionary);

    } catch (error) {
        res.json({
            "status" : false,
            "msg"    : 'Error al insertar nuevo cuestionario',
            "error"  : error
        })
    }
        
}


const getQuestionary = async(req , res) => {

    const { id } = req.params;

    try {
        
        const questionary_res = await questionary.findByPk( id , {
            include: [
                {
                    model : question,
                    include : [alternative]
                }
            ]
        });
        res.json(questionary_res);

    } catch (error) {
        res.json({
            "status" : false,
            "msg"    : 'Error al ejecutar la consulta',
            "error"  : error
        })
    }



}

export const methods = {
    createQuestionary,
    getQuestionary
}