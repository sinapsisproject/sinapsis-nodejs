import {response, Router} from "express";
import { methods as objectiveController } from "../controllers/objectives.controller.js";
import validarToken from "../helpers/validate-jwt.js";

const router = Router();

router.post("/" , validarToken , objectiveController.createobjective);

export default router;