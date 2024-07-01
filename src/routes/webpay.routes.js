import {response, Router} from "express";
import { methods as webpayController } from "../controllers/webpay.controller.js";
import pkg from 'transbank-sdk';
const {WebpayPlus} = pkg;


const router = Router();

router.use(function (req, res, next) {
  if (process.env.WPP_CC && process.env.WPP_KEY) {
    WebpayPlus.configureForProduction(process.env.WPP_CC, process.env.WPP_KEY);
  } else {
    WebpayPlus.configureForTesting();
  }
  next();
});

router.post("/order/:id_orden" , webpayController.createTransactionTicket);
router.get("/validate_ticket" , webpayController.validateTransactionTicket);


export default router;