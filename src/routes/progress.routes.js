import {response, Router} from "express";
import { methods as progressController } from "../controllers/progress.controller.js";
import validarToken from "../helpers/validate-jwt.js";

const router = Router();

router.post("/" , validarToken , progressController.createProgress);
router.delete("/" , validarToken, progressController.deleteProgres);

export default router;