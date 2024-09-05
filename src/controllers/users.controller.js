import bcryptjs from 'bcryptjs';

import { user } from '../models/user.model.js';
import { user_course } from '../models/user_course.model.js';

import Ope from 'sequelize';
const {Op} = Ope;

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
                    email: {
                        [Op.iLike]: email
                    }
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

const createCodeRecoveryPass = async(req , res) => {

    const {email} = req.body;

    const randomNumber = Math.floor(1000 + Math.random() * 9000);

    const datos = await user.update(
        { 
            code_recovery : randomNumber 
        },
        {
          where: 
            { 
                email: {
                    [Op.iLike]: email
                } 
            } 
        }
    );

    if(datos[0] == 1){    
        res.json({
            "status"    : true,
            "code"      : randomNumber
        });
    }else{
        res.json({
            "status"    : false,
            "error"     : "Error al guardar el código"
        });
    }
}


const validateCodeRecoveryPass = async(req , res) => {

    const {email , code} = req.body;

    const data = await user.findAll({
        where: {
            code_recovery   : code.toString(),
            email           : {
                [Op.iLike]: email
            }
        }
    });

    const user_data = data.map(res => res.get({plain: true}));

    if(user_data.length == 1){
        res.json({
            "status"    : true,
            "mensaje"   : "Código valido"
        });
    }else{
        res.json({
            "status"    : false,
            "mensaje"   : "Código incorrecto"
        });
    }

}


const updatePasswordByCode = async(req , res) => {

    const {email , code , password} = req.body;

    const salt = bcryptjs.genSaltSync();
    const password_encrypt = bcryptjs.hashSync(password, salt);

    user.update(
        { password: password_encrypt },
        {
          where: {
            code_recovery: code,
            email : {
                [Op.iLike]: email
            }
          }
        }
      ).then(result => {

        if(result[0] == 1){

            user.update(
                { code_recovery: null },
                {
                  where: {
                    email : {
                        [Op.iLike]: email
                    }
                  }
                }
            ).then(result => {

                res.json({
                    "status"    : true,
                    "response"  : result
                });

            }).catch(error => {
                console.error('Error al actualizar los registros:', error);
            });

        }

      }).catch(error => {
        console.error('Error al actualizar los registros:', error);
      });

}

const registerUserMasive = async(req , res) => {

    const {primer_nombre, apellido , username, email ,password , id_curso } = req.body;

    try {
        
        const response_user = await user.findAll({
            where: {
                email: {
                    [Op.iLike]: email
                }
            }
        });
        
        if(response_user.length > 0){
    
            res.json({
                "status" : false,
                "msg"    : 'El usuario ya existe'
            });
    
        }else{
            
            const salt = bcryptjs.genSaltSync();
            const password_encrypt = bcryptjs.hashSync(password, salt);

            const newUser = await user.create({
                nombre: primer_nombre+" "+apellido, 
                username, 
                email,
                password : password_encrypt, 
                estado : 'activo',
                id_tipo_usuario : 1
            });
    
            
            const course_user = await user_course.create({
                id_usuario : newUser.id, 
                id_curso : id_curso, 
                estado : "activo"
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

}

const asociarUsuarioCurso = async(req , res) => {

    const {email, id_curso } = req.body;

    try {
        
        const response_user = await user.findAll({
            where: {
                email: {
                    [Op.iLike]: email
                }
            }
        });

        if(response_user.length > 0){

            const newUser = await user_course.create({
                estado : "activo",
                id_usuario : response_user[0].id,
                id_curso
            });

            res.json({
                "status" : true,
                "response"  : newUser
            });

        }else{
            res.json({
                "status" : false,
                "usuario"  : email,
                "msg" : "NO AGREGADO"  
            });
        } 
        

    } catch (error) {
        res.json({
            "status" : false,
            "msg"    : 'Error al insertar nuevo usuario',
            "error"  : error
        })
    }

}



export const methods = {
    registerUser,
    validateUserCourse,
    createCodeRecoveryPass,
    validateCodeRecoveryPass,
    updatePasswordByCode,
    registerUserMasive,
    asociarUsuarioCurso
}