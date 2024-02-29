import jwt from "jsonwebtoken";

const secretKey = process.env.SECRETORPRIVATEKEY;

function validarToken(req, res, next) {
    // Verificar si existe el token en el header de la solicitud
    const token = req.headers['authorization'].replace('Bearer ', '');

    console.log(token);
    if (!token) {
      return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
    }
  
    // Verificar y decodificar el token
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Acceso denegado. Token inválido.' });
      } else {
        // El token es válido, adjuntar los datos decodificados a la solicitud
        req.usuario = decoded;
        next();
      }
    });
  }


  export default validarToken