import {response, Router} from "express";
import {methods as courseController} from "../controllers/course.controller.js";
import validarToken from "../helpers/validate-jwt.js";

const router = Router();

router.post("/" , validarToken , courseController.createCourse);
router.get("/"  , validarToken ,  courseController.getCourses);

export default router;