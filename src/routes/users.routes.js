import {response, Router} from "express";
import {methods as usersController} from "./../controllers/users.controller.js";
import validarToken from "../helpers/validate-jwt.js";

const router = Router();

router.post("/register" , usersController.registerUser);
router.get("/validate_course_user/:id" , validarToken , usersController.validateUserCourse);

export default router;