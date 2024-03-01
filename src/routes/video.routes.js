import {response, Router} from "express";
import { methods as videoController } from "../controllers/video.controller.js";
import validarToken from "../helpers/validate-jwt.js";

const router = Router();

router.post("/" ,  validarToken , videoController.createVideo);

export default router;