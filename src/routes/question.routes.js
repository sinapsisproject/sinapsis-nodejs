import {response, Router} from "express";
import { methods as questionController } from "../controllers/question.controller.js";


const router = Router();

router.post("/" , questionController.createQuestion);

export default router;