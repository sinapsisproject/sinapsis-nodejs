import bcryptjs from 'bcryptjs';

import { user } from '../models/user.model.js';
import { user_course } from '../models/user_course.model.js';



const registerUser = async(req , res) => {
    
    const {nombre, username, email , fecha_nacimiento ,telefono, pais ,password, estado, id_tipo_usuario } = req.body;

     /** Verificamos que el usuario ingrese el email y el password */
     if(
        typeof nombre !== 'undefined' && nombre !== null && nombre !== ""
     && typeof username !== 'undefined' && username !== null && username !== ""
     && typeof email !== 'undefined' && email !== null && email !== ""
     && typeof fecha_nacimiento !== 'undefined' && fecha_nacimiento !== null && fecha_nacimiento !== ""
     && typeof pais !== 'undefined' && pais !== null && pais !== ""
     && typeof telefono !== 'undefined' && telefono !== null && telefono !== ""
     && typeof password !== 'undefined' && password !== null && password !== ""
     && typeof estado !== 'undefined' && estado !== null && estado !== ""
     && typeof id_tipo_usuario !== 'undefined' && id_tipo_usuario !== null && id_tipo_usuario !== ""){


        try {
     

            const response_user = await user.findAll({
                where: {
                    email: email
                }
            });


            if(response_user.length > 0){

                res.json({
                    "status" : false,
                    "msg"    : 'El usuario ya existe'
                });

            }else{

                 /** encriptamos el password */
                 const salt = bcryptjs.genSaltSync();
                 const password_encrypt = bcryptjs.hashSync(password, salt);


                const newUser = await user.create({
                    nombre, 
                    username, 
                    email,
                    fecha_nacimiento, 
                    pais,
                    telefono, 
                    password : password_encrypt, 
                    estado,
                    id_tipo_usuario
                });

                res.json({'status' : true , 'data' : newUser});

            }
            
    
        } catch (error) {
            res.json({
                "status" : false,
                "msg"    : 'Error al insertar nuevo usuario',
                "error"  : error
            })
        }

    }else{
        res.json({
            "status" : false,
            "msg"    : 'Falta un dato'
        })
    }


}



const validateUserCourse = async(req , res) => {

    const { id } = req.params;
    const id_usuario = req.usuario.uid;

   await user_course.findAll({
        where: {
            id_curso : id,
            id_usuario : id_usuario
        }
    }).then(array_validate => {

        if(array_validate.length > 0){

            res.json({
                "status" : true,
                "msg"    : 'Usuario habilitado'
            })
        
        }else{
        
            res.json({
                "status" : false,
                "msg"    : 'Usuario inhabilitado para ver este contenido'
            })
        }

    }).catch(error => {
        console.error('Error al ejecutar la consulta:', error);
    });


}



export const methods = {
    registerUser,
    validateUserCourse
}