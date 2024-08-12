import generateJWT  from "./../helpers/generate-jwt.js";
import bcryptjs from 'bcryptjs';

import { user } from "../models/user.model.js";

import Ope from 'sequelize';
const {Op} = Ope;


const authLogin = async(req , res)=>{

    try {
        
        const {usuario , password} = req.body;
        // const response_user = await user.findAll({
        //     where: {
        //         username: usuario
        //     }
        // });

        const response_user = await user.findAll({
            where: {
                username: {
                    [Op.iLike]: usuario
                }
            }
        });

        if(response_user.length > 0){

            const validPassword =  bcryptjs.compareSync(password, response_user[0].password);

            if(validPassword){
                const token = await generateJWT(response_user[0].id);
                res.json({
                    "status"        : true,
                    "id"            : response_user[0].id,
                    "email"         : response_user[0].email,
                    "nombre"        : response_user[0].nombre,
                    "createdAt"    : response_user[0].createdAt,
                    "telefono"      : response_user[0].telefono,
                    "token"         : token
                });
            }else{
                res.json({
                    "status" : false,
                    "msg" : "Constraseña incorrecta"
                });
            }

        }else{
            res.json({
                "status" : false,
                "msg" : "Usuario no encontrado"
            });
        }  

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }

}



export const methods = {
    authLogin
}