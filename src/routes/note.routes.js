import {response, Router} from "express";
import { methods as noteController } from "../controllers/note.controller.js";
import validarToken from "../helpers/validate-jwt.js";

const router = Router();

router.post("/" , validarToken , noteController.createNote);

export default router;