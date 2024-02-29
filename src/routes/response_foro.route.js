import {response, Router} from "express";
import { methods as responseForoController } from "../controllers/response_foro.js";


const router = Router();

router.post("/" , responseForoController.createRespuestaForo);

export default router;