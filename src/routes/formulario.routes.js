import {response, Router} from "express";
import { methods as formularioController } from "../controllers/formulario.controller.js";
import validarToken from "../helpers/validate-jwt.js";

const router = Router();

router.post("/respuestas_formulario" , validarToken , formularioController.insertResponseFormulario);

export default router;