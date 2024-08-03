import { respuesta_formulario } from "../models/respuesta_formulario.model.js";

const insertResponseFormulario = async(req , res) => {

    const { respuestas } = req.body;
    const id_usuario = req.usuario.uid;

    try {

        let count_respuestas = respuestas.length;
        
        let c = 0;

        await Promise.all(
            respuestas.map(async (res) => {

                const response = await respuesta_formulario.create({
                    respuesta : res.respuesta, 
                    id_usuario : id_usuario,
                    id_pregunta_formulario: res.id_pregunta 
                })

                if(!response.isNewRecord){
                    c = c + 1;
                }
            })
        )

        if(c == count_respuestas){

            res.json({
                "status" : true,
                "registros" : c 
            })

        }else{
            
            res.json({
                "status" : false,
                "error"  : "Error al insertar los datos"  
            })

        }

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