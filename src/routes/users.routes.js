import {response, Router} from "express";
import {methods as usersController} from "./../controllers/users.controller.js";
import validarToken from "../helpers/validate-jwt.js";

const router = Router();

router.post("/register" , usersController.registerUser);
router.get("/validate_course_user/:id" , validarToken , usersController.validateUserCourse);
router.post("/code_recovery_pass/" , usersController.createCodeRecoveryPass);
router.post("/validate_code_recovery_pass" , usersController.validateCodeRecoveryPass);
router.post("/update_password_recovery" , usersController.updatePasswordByCode);
router.post("/register_user_masive" , usersController.registerUserMasive);

export default router;