import { module } from "./../models/module.model.js";

const createModule = async(req , res) => {

    const {nombre, estado, id_curso, ubicacion } = req.body;

    try {
        const newModule = await module.create({
            nombre,
            estado,
            id_curso,
            ubicacion
        });
    
        res.json(newModule);
        
    } catch (error) {
        res.json({
                "status" : false,
                "msg"    : 'Error al insertar nuevo modulo',
                "error"  : error
            })
    }

}


export const methods = {
    createModule
}