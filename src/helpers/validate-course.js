import { user_course } from "../models/user_course.model.js";


const validate_course = async ( req, res, next ) => {

    const { id } = req.params;
    const id_usuario = req.usuario.uid;

   await user_course.findAll({
        where: {
            id_curso : id,
            id_usuario : id_usuario
        }
    }).then(array_validate => {

        if(array_validate.length > 0){
        
            req.id_curso = id;
            next();

        }else{
        
            return res.status(403).json(
                { 
                    status : false,
                    code : 403,
                    msg: 'Usuario no suscrito a este contenido'
                });

            // res.sendStatus(403).json({
            //     status : false,
            //     code : 403,
            //     msg: 'Usuario no suscrito a este contenido'
            // });
                
        }

    }).catch(error => {
        console.error('Error al ejecutar la consulta:', error);
    });

    
   

}


export default validate_course