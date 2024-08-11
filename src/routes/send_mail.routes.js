import {response, Router} from "express";
import { methods as sendMailController } from "../controllers/send_mail.controller.js";

const router = Router();

router.post("/send_mail_recovery_pass" , sendMailController.send_mail_recovery_pass);

export default router;