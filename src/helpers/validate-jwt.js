import jwt from "jsonwebtoken";

const secretKey = process.env.SECRETORPRIVATEKEY;

function validarToken(req, res, next) {

    const token_res = req.headers['authorization'];

    if (!token_res) {

      return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });

    }else{

      const token = req.headers['authorization'].replace('Bearer ', '');

      // Verificar y decodificar el token
      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          res.status(403).json(
            { 
              status : false,
              code : 403,
              error: 'Acceso denegado. Token inválido.'
            });
        } else {
          // El token es válido, adjuntar los datos decodificados a la solicitud
          req.usuario = decoded;
          next();
        }
      });

    }
  }


  export default validarToken