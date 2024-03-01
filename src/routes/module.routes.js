import {response, Router} from "express";
import {methods as moduleController} from "../controllers/module.controller.js";
import validarToken from "../helpers/validate-jwt.js";

const router = Router();

router.post("/" , validarToken , moduleController.createModule);

export default router;