import {response, Router} from "express";
import {methods as courseController} from "../controllers/course.controller.js";
import validarToken from "../helpers/validate-jwt.js";

const router = Router();

router.post("/" , validarToken , courseController.createCourse);
router.get("/" ,  courseController.getCourses);
router.post("/assign_course_user" , validarToken , courseController.assingCourseUser);
router.get("/get_course_by_id_user/:id" , validarToken, courseController.getCoursesByIdUser);
router.get("/get_sidebar_by_id_course/:id" , validarToken, courseController.getSidebarByIdCourse);
router.get("/get_course_by_id/:id" , validarToken, courseController.getCourseById);
router.get("/get_course_by_id_free_data/:id" , courseController.getCourseByIdFreeData);
router.get("/get_content_course/:id" , courseController.getContentCourse);

export default router;