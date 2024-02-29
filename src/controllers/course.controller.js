import { course } from "../models/course.model.js";
import { module } from "../models/module.model.js";
import { video } from "../models/video.model.js";
import { note } from "../models/note.model.js";
import { text } from "../models/text.model.js";
import { questionary } from "../models/questionary.model.js";
import { foro } from "../models/foro.model.js";



const createCourse = async(req , res) => {
    
    const {nombre, descripcion, link_video , link_programa, estado, id_tipo_curso } = req.body;

    try {
     
        const newCourse = await course.create({
            nombre, 
            descripcion, 
            link_video, 
            link_programa, 
            estado, 
            id_tipo_curso
        });

        res.json(newCourse);

    } catch (error) {
        res.json({
            "status" : false,
            "msg"    : 'Error al insertar nuevo curso',
            "error"  : error
        })
    }

}


const getCourses = async(req , res) => {

    try {
        
        const courses = await course.findAll({
            include: [
                {
                    model : module,
                    include : [video, note, text, questionary, foro]
                }
            ]
        });
        res.json(courses);

    } catch (error) {
        res.json({
            "status" : false,
            "msg"    : 'Error al ejecutar la consulta',
            "error"  : error
        })
    }

}


export const methods = {
    createCourse,
    getCourses
}