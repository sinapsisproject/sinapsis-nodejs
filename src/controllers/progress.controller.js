import { progress } from './../models/progress.model.js';


const createProgress = async(req , res) => {

    const id_usuario = req.usuario.uid;

    const {id_curso, id_item , nombre_item} = req.body;

    try {
        
        const newProgress = await progress.create({
            id_curso,
            id_item,
            nombre_item,
            id_usuario
        })

        res.json({
            "status" : true,
            "response" : newProgress
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
    const {id_curso, id_item , nombre_item} = req.body;

    await progress.destroy({
        where: {
            id_curso : id_curso,
            id_item : id_item,
            id_usuario : id_usuario,
            nombre_item : nombre_item
        }
    }).then(affectedRows => {
        res.json({
            "status" : true,
            "rows" : affectedRows
        });
    }).catch(error => {
        res.json({
            "status" : false,
            "msg"    : 'Error al eliminar progreso',
            "error"  : error
        })
    });

}



export const methods = {
    createProgress,
    deleteProgres
}