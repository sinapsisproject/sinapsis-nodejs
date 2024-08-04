import {response, Router} from "express";
import { methods as encuestaController } from "../controllers/encuesta.controller.js";
import validarToken from "../helpers/validate-jwt.js";

const router = Router();

router.get("/get_preguntas_by_id_encuesta/:id" , validarToken , encuestaController.getPreguntasByIdEncuesta);

export default router;