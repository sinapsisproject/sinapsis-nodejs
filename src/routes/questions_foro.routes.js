import {response, Router} from "express";
import { methods as questionsForoController } from "../controllers/questions_foro.controller.js";


const router = Router();

router.post("/" , questionsForoController.createPreguntaForo);

export default router;