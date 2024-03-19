import { instructor } from "../models/instructor.model.js";

const createInstructor = async(req , res) => {
    
    const {nombre, especialidad, descripcion, foto} = req.body;

    try {
     
        const newInstructor = await instructor.create({
            nombre, 
            especialidad,
            descripcion,
            foto
        });

        res.json(newInstructor);

    } catch (error) {
        res.json({
            "status" : false,
            "msg"    : 'Error al insertar nuevo instructor',
            "error"  : error
        })
    }

}

export const methods = {
    createInstructor
}