import {response, Router} from "express";
import {methods as instructorController} from "../controllers/instructor.controller.js";
import validarToken from "../helpers/validate-jwt.js";


const router = Router();

router.post("/" , validarToken , instructorController.createInstructor);

export default router;