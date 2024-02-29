import {response, Router} from "express";
import { methods as questionaryController } from "../controllers/questionary.controller.js";


const router = Router();

router.post("/" , questionaryController.createQuestionary);
router.get("/:id" , questionaryController.getQuestionary);

export default router;