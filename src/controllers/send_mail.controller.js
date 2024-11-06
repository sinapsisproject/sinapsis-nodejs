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


export const methods = {
    send_mail_recovery_pass,
    
};

