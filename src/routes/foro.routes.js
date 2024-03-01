import {response, Router} from "express";
import { methods as foroController } from "../controllers/foro.controller.js";
import validarToken from "../helpers/validate-jwt.js";

const router = Router();

router.post("/" , validarToken , foroController.createForo);
router.get("/:id" , validarToken , foroController.getForo);

export default router;