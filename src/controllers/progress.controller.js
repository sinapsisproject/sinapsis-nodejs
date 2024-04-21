import { course } from '../models/course.model.js';
import { progress } from './../models/progress.model.js';
import { module } from '../models/module.model.js';
import { video } from '../models/video.model.js';


const createProgress = async(req , res) => {

    const id_usuario = req.usuario.uid;

    const {id_curso, id_item , nombre_item, total_progress} = req.body;

    try {
        
        const newProgress = await progress.create({
            id_curso,
            id_item,
            nombre_item,
            id_usuario
        })

        const count = await progress.count({
            where: {
                id_usuario: id_usuario,
                id_curso: id_curso
            }
        });

        let progress_porcentage = (count * 100) / (total_progress - 1);


        res.json({
            "status" : true,
            "response" : newProgress,
            "progress" : {
                "items" : count,
                "total_items" : total_progress,
                "porcentaje" : parseInt(progress_porcentage)
            }
        });

    } catch (error) {
        res.json({
            "status" : false,
            "msg"    : 'Error al insertar nuevo progreso',
            "error"  : error
        })
    }
        
}


const deleteProgres = async(req ,res) => {

    const id_usuario = req.usuario.uid;
    const {id_curso, id_item , nombre_item, total_progress} = req.body;

    await progress.destroy({
        where: {
            id_curso : id_curso,
            id_item : id_item,
            id_usuario : id_usuario,
            nombre_item : nombre_item
        }
    }).then(async affectedRows => {

        const count = await progress.count({
            where: {
                id_usuario: id_usuario,
                id_curso: id_curso
            }
        });

        let progress_porcentage = (count * 100) / (total_progress - 1);

        res.json({
            "status" : true,
            "rows" : affectedRows,
            "progress" : {
                "items" : count,
                "total_items" : total_progress,
                "porcentaje" : parseInt(progress_porcentage)
            }
        });
    }).catch(error => {
        res.json({
            "status" : false,
            "msg"    : 'Error al eliminar progreso',
            "error"  : error
        })
    });

}

const progressData = async(req , res) => {

    const id_usuario = req.usuario.uid;
    const {id_curso, total_progress} = req.body;


    const count = await progress.count({
        where: {
            id_usuario: id_usuario,
            id_curso: id_curso
        }
    });

    let progress_porcentage = (count * 100) / (total_progress - 1);

    res.json({
        "status" : true,
        "items" : count,
        "total_items" : total_progress,
        "porcentaje" : parseInt(progress_porcentage)
    });

}   



export const methods = {
    createProgress,
    deleteProgres,
    progressData
}