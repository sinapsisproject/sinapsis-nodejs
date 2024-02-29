import { question } from './../models/question.model.js';
import { alternative } from '../models/alternativa.model.js';
import { sequelize } from '../database/database.js';

const createQuestion = async(req , res) => {

    const {pregunta, tipo, justificacion , id_cuestionario, alternativas} = req.body;

        var response;
        var alternative_array = [];
        try {

            sequelize.transaction(async (t) => {
                // Insertar el padre y obtener el objeto Padre creado
                const question_res = await question.create({pregunta, tipo, justificacion, id_cuestionario}, { transaction: t });
              
                // Insertar los hijos asociados al padre
                await Promise.all(alternativas.map(async (alternativa) => {
                    alternative_array.push(await alternative.create({ ...alternativa, id_pregunta: question_res.id }, { transaction: t }));
                }));

                response = { "question" : question_res , "alternatives" : alternative_array}

              })
              .then(() => {
                res.json(response);
              })
              .catch(err => {
                console.error('Error al insertar datos:', err);
              });

        } catch (error) {
            res.json({
                    "status" : false,
                    "msg"    : 'Error al insertar nueva pregunta',
                    "error"  : error
                })
        }

}

export const methods = {
    createQuestion
}