import {response, Router} from "express";
import { methods as payController } from "../controllers/pay.controller.js";
import validarToken from "../helpers/validate-jwt.js";
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

router.post("/create" , validarToken , payController.createTransaction);
router.get("/validate" , payController.validateTransaction);
router.get("/data_order/:id" , payController.getDataPagoOkByOrder);

export default router;