import {response, Router} from "express";
import { methods as noteController } from "../controllers/note.controller.js";


const router = Router();

router.post("/" , noteController.createNote);

export default router;