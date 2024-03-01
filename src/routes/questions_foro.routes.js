import {response, Router} from "express";
import { methods as questionsForoController } from "../controllers/questions_foro.controller.js";
import validarToken from "../helpers/validate-jwt.js";

const router = Router();

router.post("/" , validarToken , questionsForoController.createPreguntaForo);

export default router;