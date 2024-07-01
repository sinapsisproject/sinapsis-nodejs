import {response, Router} from "express";
import { methods as paypalController } from "../controllers/paypal.controller.js";


const router = Router();

router.post("/order"  , paypalController.createOrder);
router.get("/success"  , paypalController.successPay);
router.get("/cancel"  , paypalController.cancelPay);

export default router;