import {response, Router} from "express";

import {methods as authController} from "./../controllers/auth.controller.js";

const router = Router();

router.get("/"          , authController.authLogin);

export default router;