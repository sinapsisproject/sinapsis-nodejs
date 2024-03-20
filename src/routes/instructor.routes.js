import {response, Router} from "express";
import {methods as instructorController} from "../controllers/instructor.controller.js";
import validarToken from "../helpers/validate-jwt.js";


const router = Router();

router.post("/" , validarToken , instructorController.createInstructor);
router.get("/" , instructorController.getInstructors);
router.get("/:id" , instructorController.getInstructorById);

export default router;