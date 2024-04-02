import {response, Router} from "express";
import {methods as courseController} from "../controllers/course.controller.js";
import validarToken from "../helpers/validate-jwt.js";
import validate_course from "../helpers/validate-course.js";

const router = Router();

router.post("/" , validarToken , courseController.createCourse);
router.get("/" ,  courseController.getCourses);
router.post("/assign_course_user" , validarToken , courseController.assingCourseUser);
router.get("/get_course_by_id_user/:id" , validarToken, courseController.getCoursesByIdUser);
router.get("/get_course_by_id_free_data/:id" , courseController.getCourseByIdFreeData);
router.get("/get_content_course/:id" , courseController.getContentCourse);
router.get("/get_course_by_id_instructor/:id" , courseController.getCourseByIdInstructor);


router.get("/get_course_by_id/:id" , validarToken, validate_course, courseController.getCourseById);
router.get("/get_sidebar_by_id_course/:id" , validarToken , validate_course , courseController.getSidebarByIdCourse);


export default router;