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

        // Verificar si el usuario ya tiene respuestas para esta encuesta
        const existingRespuestas = await encuesta_respuesta.findOne({
            where: { id_usuario },
            include: [
                {
                    model: encuesta_alternativa,
                    include: [
                        {
                            model: encuesta_pregunta,
                            where: { id_encuesta }, // Validar por encuesta específica
                        },
                    ],
                },
            ],
        });

        if (existingRespuestas) {
            return res.status(400).json({
                status: false,
                response: 'Ya has respondido esta encuesta',
            });
        }

        // Insertar las nuevas respuestas
        if (respuestas.length > 0) {
            await Promise.all(
                respuestas.map(async (id_respuesta) => {
                    await encuesta_respuesta.create({
                        id_encuesta_alternativa: id_respuesta,
                        id_usuario,
                    });
                })
            );

            res.json({
                status: true,
                response: 'Respuestas guardadas correctamente',
            });
        } else {
            res.status(400).json({
                status: false,
                response: 'No hay respuestas para guardar',
            });
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: 'Error al guardar las respuestas',
            error,
        });
    }
};

export const methods = {
    getPreguntasByIdEncuesta,
    insertResponseFormularios,
};
