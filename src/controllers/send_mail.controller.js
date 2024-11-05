import nodemailer from 'nodemailer';
import { Op } from 'sequelize';
import path from 'path';
import fs  from 'fs';
import ejs from 'ejs';
import { fileURLToPath } from 'url';


const send_mail_recovery_pass = async(req , res) => {

    const { email , code } = req.body;

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const htmlPath = path.join(__dirname, 'ticketera' , 'assets', 'templates', 'recovery_pass.ejs');

    //fs.readFile(htmlPath, 'utf8', (err, html) => {
    ejs.renderFile(htmlPath, { code , email }, (err, html) => {
        if (err) {
            return res.status(500).send('Error al leer el archivo HTML');
        }else{
            const transporter = nodemailer.createTransport({
                service: 'gmail', // Puedes usar otros servicios como Yahoo, Outlook, etc.
                auth: {
                    user: 'contacto@sinapsisclinica.com', // Tu correo electrónico
                    pass: process.env.CLAVE_APP_GMAIL // Tu contraseña
                }
            });

            const mailOptions = {
                from: 'contacto@sinapsisclinica.com', // Dirección del remitente
                to: email, // Dirección del destinatario
                subject: 'Recuperacion de contraseña', // Asunto del correo
                //text: 'Contenido del correo en texto plano', // Cuerpo del correo en texto plano
                html: html 
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Correo enviado: ' + info.response);
                res.json({
                    "status"        : true,
                    "response"      : "Correo enviado"
                 });
            });

        }
    });

}

// Nueva función para enviar el correo al responder el cuestionario con id = 13
const send_mail_quiz_response = async (usuario) => {
    // Ruta del archivo de plantilla de correo
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const htmlPath = path.join(__dirname, 'ticketera', 'assets', 'templates', 'quiz_response.ejs');

    // Renderizar la plantilla de correo con EJS
    ejs.renderFile(htmlPath, { usuario }, (err, html) => {
        if (err) {
            console.error('Error al leer el archivo HTML');
            return;
        } else {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'contacto@sinapsisclinica.com',
                    pass: process.env.CLAVE_APP_GMAIL
                }
            });

            const mailOptions = {
                from: 'contacto@sinapsisclinica.com',
                to: 'adagnino@sinapsisclinica.com, nicolasgomez7@live.cl', // Correo de los administradores
                subject: `Respuesta al cuestionario por ${usuario.nombre}`,
                html: html
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Correo enviado a administradores: ' + info.response);
            });
        }
    });
};

// Función de ejemplo para manejar la respuesta del cuestionario
const handle_quiz_response = async (req, res) => {
    const { id_cuestionario, nombre_usuario, email_usuario } = req.body;

    // Verificar si el cuestionario es el de id = 13
    if (id_cuestionario === 13) {
        // Datos del usuario
        const usuario = {
            nombre: nombre_usuario,
            email: email_usuario
        };

        // Enviar correo a los administradores
        await send_mail_quiz_response(usuario);
    }

    res.json({
        "status": true,
        "response": "Respuesta del cuestionario procesada"
    });
};

export const methods = {
    send_mail_recovery_pass,
    handle_quiz_response
};

