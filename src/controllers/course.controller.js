import jwt from "jsonwebtoken";
const secretKey = process.env.SECRETORPRIVATEKEY;

import { course } from "../models/course.model.js";
import { module } from "../models/module.model.js";
import { video } from "../models/video.model.js";
import { note } from "../models/note.model.js";
import { text } from "../models/text.model.js";
import { questionary } from "../models/questionary.model.js";
import { foro } from "../models/foro.model.js";
import { user_course } from "../models/user_course.model.js";
import { instructor } from "../models/instructor.model.js";
import { question } from "../models/question.model.js";
import { alternative } from "../models/alternativa.model.js";
import { questions_foro } from "../models/questions_foro.model.js";
import { response_foro } from "../models/response_foro.js";
import { progress } from "../models/progress.model.js";



const createCourse = async(req , res) => {
    
    const {nombre, descripcion, link_video , link_programa, estado, id_tipo_curso, imagen ,precio, metodologia, duracion } = req.body;

    try {
     
        const newCourse = await course.create({
            nombre, 
            descripcion, 
            link_video, 
            link_programa, 
            estado, 
            id_tipo_curso,
            imagen,
            precio,
            metodologia,
            duracion
        });

        res.json(newCourse);

    } catch (error) {
        res.json({
            "status" : false,
            "msg"    : 'Error al insertar nuevo curso',
            "error"  : error
        })
    }

}


// ASIGNAR CURSOS CUANDO SE REALIZA EL PAGO
const assingCourseUser = async(req, res) => {

    try {
        
        const { id_usuario , id_curso , estado } = req.body;

        const course_user = await user_course.create({
            id_usuario, 
            id_curso, 
            estado
        });

        res.json(course_user);

    } catch (error) {
        res.json({
            "status" : false,
            "msg"    : 'Error al asignar un nuevo curso',
            "error"  : error
        })
    }

}



const getCoursesByIdUser = async(req , res) => {

    try {
        
        const { id } = req.params;

        const courses = await user_course.findAll({
            where: {
                id_usuario: id
            },
            include: [
                {
                    model : course,
                    include: [module]
                }
            ]
        });
        res.json(courses);

    } catch (error) {
        res.json({
            "status" : false,
            "msg"    : 'Error en la consulta',
            "error"  : error
        })
    }

}


const getSidebarByIdCourse = async(req , res) => {

        const id_usuario = req.usuario.uid;
        var existe;
        const { id } = req.params;

        let lista = {};
        let object = [];
        let tem = [];

        const progress_user  = await progress.findAll({
            where: {
                id_curso : id,
                id_usuario : id_usuario
            }
        });


        const data =  await module.findAll({
            where: {
                id_curso : id
            },
            include: [
                video, 
                note, 
                text, 
                {
                    model: questionary,
                    include: [
                        {
                            model: question,
                            include:[alternative]
                        }
                    ]
                }, 
                {
                    model: foro,
                    include : [
                        {
                            model: questions_foro,
                            include: [
                                {
                                    model: response_foro
                                }
                            ]
                        }
                    ]
                }
            ],
            order : [
                ['ubicacion' , 'ASC'],
                [foro, questions_foro, 'createdAt', 'DESC'],
                [foro, questions_foro, response_foro, 'createdAt', 'ASC'] 
            ]          
        });

        let count = 0;

        await Promise.all(
            data.map(async (dato) => {
                
                lista.id        = dato.dataValues.id;
                lista.nombre    = dato.dataValues.nombre;
                lista.estado    = dato.dataValues.estado;
                lista.ubicacion = dato.dataValues.ubicacion;
                lista.tipo      = 'modulo';

                object.push(lista);

                

                dato.dataValues.videos.map(video => video.dataValues).map( (video) =>{
                    count++;
                    video.tipo = 'video';
                    existe = progress_user.some(datos => datos.nombre_item == video.tipo && datos.id_item == video.id);
                    video.done = existe ? true : false;
                    tem.push(video);
                })

                dato.dataValues.apuntes.map(apunte => apunte.dataValues).map( (apunte) =>{
                    count++;
                    apunte.tipo = 'apunte';
                    existe = progress_user.some(datos => datos.nombre_item == apunte.tipo && datos.id_item == apunte.id);
                    apunte.done = existe ? true : false;
                    tem.push(apunte);
                })

                dato.dataValues.textos.map(texto => texto.dataValues).map( (texto) =>{
                    count++;
                    texto.tipo = 'texto';
                    existe = progress_user.some(datos => datos.nombre_item == texto.tipo && datos.id_item == texto.id);
                    texto.done = existe ? true : false;
                    tem.push(texto);
                })

                dato.dataValues.cuestionarios.map(cuestionario => cuestionario.dataValues).map( (cuestionario) =>{
                    count++;
                    cuestionario.tipo = 'cuestionario';
                    existe = progress_user.some(datos => datos.nombre_item == cuestionario.tipo && datos.id_item == cuestionario.id);
                    cuestionario.done = existe ? true : false;
                    tem.push(cuestionario);
                })

                dato.dataValues.foros.map(foro => foro.dataValues).map( (foro) =>{
                    foro.tipo = 'foro';
                    existe = progress_user.some(datos => datos.nombre_item == foro.tipo && datos.id_item == foro.id);
                    foro.done = existe ? true : false;
                    tem.push(foro);
                })



                tem.sort(compararPorUbicacion)

                tem.map((v) => {
                    object.push(v)
                })


                lista = {};
                tem = [];

            })
        )

        res.json(
            {
                "response" : object,
                "total_progress" : count
            }
        );   

}


function compararPorUbicacion(a, b) {
    return a.ubicacion - b.ubicacion;
}

const getCourses = async(req , res) => {

    try {
        
        const courses = await course.findAll({});
        res.json(courses);

    } catch (error) {
        res.json({
            "status" : false,
            "msg"    : 'Error al ejecutar la consulta',
            "error"  : error
        })
    }

}

const getCourseById = async(req , res) => {

    try {

        const { id } = req.params;

        const curso = await course.findAll({
            where: {
                id : id
            },
            include: [
                {
                    model : module,
                    include : [video, note, text, questionary, foro]
                }
            ]
        });
        res.json(curso[0]);

    } catch (error) {
        res.json({
            "status" : false,
            "msg"    : 'Error al ejecutar la consulta',
            "error"  : error
        })
    }

}


const getCourseByIdFreeData = async(req , res) => {

    try {

        const { id } = req.params;

        const curso = await course.findAll({
            where: {
                id : id
            },
            include: [
                {
                    model : instructor
                }
            ]
        });
        res.json(curso[0]);

    } catch (error) {
        res.json({
            "status" : false,
            "msg"    : 'Error al ejecutar la consulta',
            "error"  : error
        })
    }

}


const getContentCourse= async(req , res) => {
   
    const { id } = req.params;

    let lista = {};
    let object = [];
    let tem = [];

    const data =  await module.findAll({
        where: {
            id_curso : id
        },
        order : [['ubicacion' , 'ASC']],
        include: [video, note, text, questionary, foro]           
    });


    await Promise.all(
        data.map(async (dato) => {
            
            lista.id        = dato.dataValues.id;
            lista.nombre    = dato.dataValues.nombre;
            lista.estado    = dato.dataValues.estado;
            lista.ubicacion = dato.dataValues.ubicacion;
            lista.tipo      = 'modulo';

            object.push(lista);

            
            dato.dataValues.videos.map(video => video.dataValues).map( (video) =>{
                video.tipo = 'video';
                tem.push(video);
            })

            dato.dataValues.apuntes.map(apunte => apunte.dataValues).map( (apunte) =>{
                apunte.tipo = 'apunte';
                tem.push(apunte);
            })

            dato.dataValues.textos.map(texto => texto.dataValues).map( (texto) =>{
                texto.tipo = 'texto';
                tem.push(texto);
            })

            dato.dataValues.cuestionarios.map(cuestionario => cuestionario.dataValues).map( (cuestionario) =>{
                cuestionario.tipo = 'cuestionario';
                tem.push(cuestionario);
            })

            dato.dataValues.foros.map(foro => foro.dataValues).map( (foro) =>{
                foro.tipo = 'foro';
                tem.push(foro);
            })


            tem.sort(compararPorUbicacion)

            // tem.map((v) => {
            //     object.push(v)
            // })

            lista.contenido = tem;

            //object.push(tem);


            lista = {};
            tem = [];

        })
    )


    res.json(object);   

}




const getCourseByIdInstructor = async(req , res) => {

    try {

        const { id } = req.params;

        const cursos = await course.findAll({
            where: {
                id_instructor : id
            }
        });
        res.json(cursos);

    } catch (error) {
        res.json({
            "status" : false,
            "msg"    : 'Error al ejecutar la consulta',
            "error"  : error
        })
    }

}




export const methods = {
    assingCourseUser,
    createCourse,
    getCourses,
    getCoursesByIdUser,
    getSidebarByIdCourse,
    getCourseById,
    getCourseByIdFreeData,
    getContentCourse,
    getCourseByIdInstructor
}