import { questionary } from './../models/questionary.model.js';
import { question } from '../models/question.model.js';
import { alternative } from '../models/alternativa.model.js';
import { response_questionary } from '../models/response_questionary.model.js';
import { course } from '../models/course.model.js';
import { module } from '../models/module.model.js';
import { user } from '../models/user.model.js';

import Ope from 'sequelize';
const {Op} = Ope;

const createQuestionary = async(req , res) => {

    const {nombre, descripcion , estado, aprobacion, tiempo, ubicacion, id_modulo, clase, ponderacion} = req.body;

    try {
        
        const newQuestionary = await questionary.create({
            nombre,
            descripcion,
            estado,
            aprobacion,
            tiempo,
            ubicacion,
            id_modulo,
            clase,
            ponderacion
        })

        res.json(newQuestionary);

    } catch (error) {
        res.json({
            "status" : false,
            "msg"    : 'Error al insertar nuevo cuestionario',
            "error"  : error
        })
    }
        
}


const getQuestionary = async(req , res) => {

    const { id } = req.params;

    try {
        
        const questionary_res = await questionary.findByPk( id , {
            include: [
                {
                    model : question,
                    include : [alternative]
                }
            ]
        });
        res.json(questionary_res);

    } catch (error) {
        res.json({
            "status" : false,
            "msg"    : 'Error al ejecutar la consulta',
            "error"  : error
        })
    }

}


const assessmentTestByUser = async(req, res) => {

    const { id_questionary } = req.params;
    const id_usuario = req.usuario.uid;

    try {
        
        const assessment = await questionary.findAll({
            where: {
                id : id_questionary
            },
            attributes : ['id' , 'nombre', 'aprobacion'],
            include: [
                {
                    model: question,
                    attributes : ['id', 'puntaje', 'pregunta', 'justificacion'],
                    include:
                    [
                        {
                            model: alternative,
                            attributes : ['id', 'alternativa', 'opcion'],
                            include: [
                                {
                                    model: response_questionary,
                                    where: {
                                        id_usuario: id_usuario
                                    },
                                    attributes : ['id', 'id_alternativa', 'id_usuario']
                                }
                            ]
                        }
                    ]
                }
            ]
        })

        if(assessment.length == 0){
            res.json({
                "status" : false,
                "response" : assessment,
                "msg" : "Este usuario no ha realizado el test ID: "+id_questionary
            });
        }else{

            let estado = '';
            let aprobacion = assessment[0].aprobacion;

            let suma_puntaje = 0;
            let cantidad_preguntas = 0;
            let preguntas_correctas = 0;
            assessment[0].pregunta.forEach(element => {
        
                cantidad_preguntas = cantidad_preguntas + 1;

                let puntaje_pregunta = element.dataValues.puntaje;
                if(element.dataValues.alternativas.length > 0 ){
                    if(element.dataValues.alternativas[0].opcion == 'correcta'){
                        preguntas_correctas = preguntas_correctas + 1;
                        suma_puntaje = suma_puntaje + puntaje_pregunta;
                    }else{
                        suma_puntaje = suma_puntaje + 0;
                    }
                }else{
                    suma_puntaje = suma_puntaje + 0;
                }
                
            });

            if(suma_puntaje >= aprobacion){
                estado = "aprobado";
            }else{
                estado = "reprobado";
            }

            res.json({
                "status" : true,
                "response" : assessment,
                "puntaje" : suma_puntaje,
                "preguntas" : cantidad_preguntas,
                "correctas" : preguntas_correctas,
                "estado" : estado
            });

        }
        

    } catch (error) {
        res.json({
            "status" : false,
            "msg"    : 'Error al ejecutar la consulta',
            "error"  : error
        })
    }

}

//AGREGAR BOTON CON INFORMACION DE CURSOS TERMINADOS (SI TERMINA TODAS SUS PRUEBAS EL CURSO ESTA TERMINADO) Y CON INFORMACION DE PRUEBAS DE UN CURSO

const assessmentFinalByUser = async(req, res) => {

    const id_usuario = req.usuario.uid;
    const { id_course } = req.params;
    let evaluaciones = [];
    try {
        
        const assessmentFinal = await course.findAll({
            where: {
                id : id_course
            },
            attributes : ['id' , 'nombre', 'nota_aprobacion'],
            include: [
                {
                    model: module,
                    attributes: ['id' , 'nombre'],
                    include: [
                        {
                            model: questionary,
                            attributes: ["id" , "nombre" , "aprobacion" , "clase", "ponderacion"],
                            where: {
                                [Op.or]: [
                                    { clase: "sumativa" },
                                    { clase: "final" },
                                    { clase: "recuperativa" }
                                ]
                            },
                            include: [
                                {
                                    model: question,
                                    attributes: ["id" , "puntaje"],
                                    include: [
                                        {
                                            model: alternative,
                                            attributes: ["id" , "opcion"],
                                            include: [
                                                {
                                                    model: response_questionary,
                                                    where : {
                                                        id_usuario : id_usuario
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            order : [
                [module , questionary, 'id', 'ASC']
            ]
        });


        const dataUser = await user.findByPk(id_usuario, {
            attributes: ["nombre" , "email"]
        });


        const objectJson = assessmentFinal.map(res => res.get({plain: true}));

        let nota_aprobacion = objectJson[0].nota_aprobacion;
        let suma_puntos_ponderados = 0;
        let puntos_ponderados_final = 0;

        objectJson[0].modulos.forEach(modulo => {

            modulo.cuestionarios.forEach(prueba => {
                let id_prueba = prueba.id;
                let nombre = prueba.nombre;
                let aprobacion = prueba.aprobacion;
                let puntaje = 0;
                let porcentaje_ponderacion = prueba.ponderacion;
                let clase = prueba.clase;

                prueba.pregunta.forEach(pregunta =>{

                    if(pregunta.alternativas.length == 0){
                        puntaje = null;
                    }else{
                        if(pregunta.alternativas[0].opcion == "correcta"){
                            puntaje = puntaje + pregunta.puntaje;
                        }
                    }
                    
                })


                let estado = puntaje >= aprobacion ? "aprobado" : "no aprobado";
                    estado = puntaje == null ? null : estado;

                let puntos_ponderados = (puntaje * porcentaje_ponderacion) / 100;

                suma_puntos_ponderados = suma_puntos_ponderados + puntos_ponderados;


                if(clase == "final"){
                    puntos_ponderados_final = puntos_ponderados;
                }

                if(clase == "recuperativa" && puntaje != null){
                    if(puntos_ponderados_final < puntos_ponderados){
                        suma_puntos_ponderados = suma_puntos_ponderados - puntos_ponderados_final;
                    }else{
                        suma_puntos_ponderados = suma_puntos_ponderados - puntos_ponderados;
                    }
                }


                let object = {
                    "id" : id_prueba,
                    "nombre" : nombre,
                    "aprobacion" : aprobacion,
                    "puntaje" : puntaje,
                    "estado" : estado,
                    "porcentaje_ponderacion" : porcentaje_ponderacion,
                    "puntos_ponderados" : puntos_ponderados,
                    "clase" : clase
                }

                evaluaciones.push(object);

            })
        })

        let estado_final = suma_puntos_ponderados >= nota_aprobacion ? "aprobado" : "no aprobado";


        res.json({
            "status"    : true,
            "datos_usuario" : dataUser,
            "pruebas"  : evaluaciones,
            "notas_finales" : {
                "nota_aprobacion" : nota_aprobacion,
                "suma_puntos_ponderados" : suma_puntos_ponderados,
                "estado_final" : estado_final
            }
        })

    } catch (error) {
        res.json({
            "status" : false,
            "msg"    : 'Error al ejecutar la consulta',
            "error"  : error
        })
    }

}



export const methods = {
    createQuestionary,
    getQuestionary,
    assessmentTestByUser,
    assessmentFinalByUser
}