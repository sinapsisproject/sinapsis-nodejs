import {response, Router} from "express";
import { methods as textController } from "../controllers/text.controller.js";


const router = Router();

router.post("/" , textController.createText);

export default router;