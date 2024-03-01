import {response, Router} from "express";
import { methods as textController } from "../controllers/text.controller.js";
import validarToken from "../helpers/validate-jwt.js";

const router = Router();

router.post("/" , validarToken , textController.createText);

export default router;