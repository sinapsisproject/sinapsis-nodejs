import {response, Router} from "express";
import { methods as activecampaign } from "../controllers/activecampaign.controller.js";
import validarToken from "../helpers/validate-jwt.js";

const router = Router();

router.use(function (req, res, next) {
    req.url_base = process.env.ACTIVECAMPAIGN_URL_BASE;
    req.headers = {accept: 'application/json', 'content-type': 'application/json' , 'Api-Token': process.env.ACTIVECAMPAIGN_API_KEY}
    next();
});


router.get("/contact"  , activecampaign.getContact);
router.get("/list_fields"  , activecampaign.listFields);
router.post("/contact"  , activecampaign.createContact);
router.post("/send_mail_template" , activecampaign.sendMailTemplate);

export default router;