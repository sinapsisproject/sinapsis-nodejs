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

const getInstructors = async(req , res) => {

    try {
        const instructores = await instructor.findAll({});
       
        res.json({
            "status" : true,
            "response" : instructores
        })

    } catch (error) {
        res.json({
            "status" : false,
            "msg"    : 'Error al ejecutar la consulta',
            "error"  : error
        })
    }
}


const getInstructorById = async(req , res) => {

    try {
        
        const { id } = req.params;

        const profesor = await instructor.findByPk(id);

        res.json({
            "status" : true,
            "response" : profesor
        })


    } catch (error) {
        res.json({
            "status" : false,
            "msg"    : 'Error en la consulta',
            "error"  : error
        })
    }

}



export const methods = {
    createInstructor,
    getInstructorById,
    getInstructors
}