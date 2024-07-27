import {response, Router} from "express";
import {methods as productos_ticketController } from "../../controllers/ticketera/productos_ticket.controller.js";

const router = Router();

router.get("/productos/:id" , productos_ticketController.getDataByTypeUser);
router.get("/usuarios/" , productos_ticketController.getTypeUserTicket);
router.post("/create_order_ticket" , productos_ticketController.createOrderProducts);
router.post("/register_user_ticket" , productos_ticketController.registerUserTickets);
router.get("/get_order_by_id/:id" , productos_ticketController.getOrderById);
router.get("/get_user_ticket_by_id/:id" , productos_ticketController.getUserTicketById);
router.get("/send_mail_user_ticket" , productos_ticketController.sendMailUserTicket);
router.post("/login_user_ticket" , productos_ticketController.loginUserTicket);


router.get("/validar_codigo_descuento/:codigo" , productos_ticketController.validarCodigoDescuento);

export default router;