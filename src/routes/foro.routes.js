import {response, Router} from "express";
import { methods as foroController } from "../controllers/foro.controller.js";


const router = Router();

router.post("/" , foroController.createForo);
router.get("/:id" , foroController.getForo);

export default router;