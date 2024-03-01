import {response, Router} from "express";
import { methods as questionController } from "../controllers/question.controller.js";
import validarToken from "../helpers/validate-jwt.js";

const router = Router();

router.post("/" , validarToken , questionController.createQuestion);

export default router;