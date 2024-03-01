import {response, Router} from "express";
import { methods as responseForoController } from "../controllers/response_foro.js";
import validarToken from "../helpers/validate-jwt.js";

const router = Router();

router.post("/" , validarToken , responseForoController.createRespuestaForo);

export default router;