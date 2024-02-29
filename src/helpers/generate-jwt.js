//const jwt = require('jsonwebtoken');
import jwt from "jsonwebtoken";


const generateJWT = ( uid='') => {

    return new Promise((resolve, reject) => {

        const payload = { uid };

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '30m'
        }, (err, token) => {
            if(err){
                reject( 'No se pudo generar el token' )
            }else{
                resolve(token)
            }
        })

    })

}


export default generateJWT
