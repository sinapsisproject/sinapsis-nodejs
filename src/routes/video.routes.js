import {response, Router} from "express";
import { methods as videoController } from "../controllers/video.controller.js";


const router = Router();

router.post("/" , videoController.createVideo);

export default router;