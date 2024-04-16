import {response, Router} from "express";
import { methods as questionaryController } from "../controllers/questionary.controller.js";
import validarToken from "../helpers/validate-jwt.js";

const router = Router();

router.post("/" , validarToken , questionaryController.createQuestionary);
router.get("/:id" , validarToken ,  questionaryController.getQuestionary);
router.get("/assessment/:id_questionary" , validarToken ,  questionaryController.assessmentTestByUser);
router.get("/assessment_final/:id_course" , validarToken ,  questionaryController.assessmentFinalByUser);

export default router;