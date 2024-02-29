import bcryptjs from 'bcryptjs';

import { user } from '../models/user.model.js';



const registerUser = async(req , res) => {
    
    const {nombre, username, email , telefono, password, estado, id_tipo_usuario } = req.body;


     /** Verificamos que el usuario ingrese el email y el password */
     if(
        typeof nombre !== 'undefined' && nombre !== null && nombre !== ""
     && typeof username !== 'undefined' && username !== null && username !== ""
     && typeof email !== 'undefined' && email !== null && email !== ""
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
                    telefono, 
                    password : password_encrypt, 
                    estado,
                    id_tipo_usuario
                });
        
                res.json(newUser);

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



const getUser = async(req , res) => {

    const { id } = req.params;

    res.json({
        "status" : true,
        "datos"  : [{"dato1" : "dato1"},{"dato2" : "dato2"},{"dato3" : "dato3"},]
    })

}



export const methods = {
    registerUser,
    getUser
}