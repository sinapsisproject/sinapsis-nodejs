import { encuesta } from './../models/encuesta.model.js';
import { encuesta_pregunta } from '../models/encuesta_pregunta.model.js';
import { encuesta_alternativa } from '../models/encuesta_alternativa.model.js';
import { encuesta_respuesta } from '../models/encuesta_respuesta.model.js';

const getPreguntasByIdEncuesta = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await encuesta.findAll({
            where: { id },
            include: [
                {
                    model: encuesta_pregunta,
                    include: [{ model: encuesta_alternativa }],
                },
            ],
            order: [[encuesta_pregunta, encuesta_alternativa, 'id', 'DESC']],
        });

        res.json({
            status: true,
            response: data,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: 'Error al ejecutar la consulta',
            error,
        });
    }
};

const insertResponseFormularios = async (req, res) => {
    try {
        const { respuestas, id_encuesta } = req.body;
        const id_usuario = req.usuario.uid;

        if (!respuestas || respuestas.length === 0) {
            return res.json({
                status: false,
                response: 'No hay respuestas',
            });
        }

        // Verificar si el usuario ya tiene respuestas para esta encuesta
        const existingRespuestas = await encuesta_respuesta.findAll({
            where: { id_usuario },
            include: [
                {
                    model: encuesta_alternativa,
                    include: [
                        {
                            model: encuesta_pregunta,
                            where: { id_encuesta },
                        },
                    ],
                },
            ],
        });

        if (existingRespuestas.length > 0) {
            return res.json({
                status: false,
                response: 'Ya existen respuestas para esta encuesta',
            });
        }

        // Guardar nuevas respuestas
        await Promise.all(
            respuestas.map(async (id_respuesta) => {
                const existingResponse = await encuesta_respuesta.findOne({
                    where: {
                        id_encuesta_alternativa: id_respuesta,
                        id_usuario,
                    },
                });

                if (!existingResponse) {
                    await encuesta_respuesta.create({
                        id_encuesta_alternativa: id_respuesta,
                        id_usuario,
                    });
                } else {
                    console.log(
                        `La respuesta ya fue registrada para la alternativa ${id_respuesta} del usuario ${id_usuario}`
                    );
                }
            })
        );

        res.json({
            status: true,
            response: 'Datos ingresados',
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: 'Error al guardar respuestas',
            error,
        });
    }
};

export const methods = {
    getPreguntasByIdEncuesta,
    insertResponseFormularios,
};
