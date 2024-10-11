import { respuesta_formulario } from "../models/respuesta_formulario.model.js";

const insertResponseFormulario = async(req , res) => {

    const { respuestas } = req.body;
    const id_usuario = req.usuario.uid;

    try {

         // Filtrar respuestas válidas, es decir, aquellas que no están en blanco o nulas
         const respuestasValidas = respuestas.filter(res => res.respuesta !== null && res.respuesta !== '');

        let count_respuestas = respuestasValidas.length;
        
        let c = 0;

        // Procesar solo las respuestas válidas
        await Promise.all(
            respuestasValidas.map(async (res) => {

                const response = await respuesta_formulario.create({
                    respuesta : res.respuesta, 
                    id_usuario : id_usuario,
                    id_pregunta_formulario: res.id_pregunta 
                })

                if(!response.isNewRecord){
                    c = c + 1;
                }
            })
        );
          // Responder sin generar errores en caso de respuestas vacías
          res.json({
            "status": true,
            "registros": c
        });

   

    } catch (error) {
        res.json({
            "status" : false,
            "msg"    : 'Error al insertar nuevo resultado',
            "error"  : error
        })
    }

}


export const methods = {
    insertResponseFormulario
}