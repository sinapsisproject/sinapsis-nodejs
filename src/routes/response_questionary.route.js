import {response, Router} from "express";
import { methods as response_questionaryController } from "../controllers/response_questionary.controller.js";
import validarToken from "../helpers/validate-jwt.js";

const router = Router();

router.post("/" , validarToken , response_questionaryController.createResponseQuestionary);
router.post("/correction_alternative" , validarToken , response_questionaryController.correctionAlternative);

export default router;