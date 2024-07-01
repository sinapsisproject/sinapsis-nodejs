import express from "express";
import cors from "cors";
import { config } from "dotenv";
config();

//Routes import
import usersRoutes from "./routes/users.routes.js";
import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
import moduleRoutes from "./routes/module.routes.js";
import videoRoutes from "./routes/video.routes.js";
import noteRoutes from "./routes/note.routes.js";
import textRoutes from "./routes/text.routes.js";
import questionaryRoutes from "./routes/questionary.routes.js";
import questionRoutes from "./routes/question.routes.js";
import foroRoutes from "./routes/foro.routes.js";
import questions_foroRoutes from "./routes/questions_foro.routes.js";
import response_foroRoutes from "./routes/response_foro.route.js";
import instructorRoutes from "./routes/instructor.routes.js";
import response_questionaryRoutes from "./routes/response_questionary.route.js";
import progressRoutes from "./routes/progress.routes.js";
import payRoutes from "./routes/pay.routes.js";
import activecampaign from "./routes/activecampaign.routes.js";
import objectiveRoutes from "./routes/objective.routes.js";

import ticketRoutes from "./routes/ticketera/productos_ticket.routes.js";
import paypalRoutes from "./routes/paypal.routes.js";
import webpayRoutes from "./routes/webpay.routes.js";

const app = express();

//settings
app.set("port" , process.env.PORT);

// middlewares
app.use(express.json());
app.use(cors());


//Routes
app.use("/api/auth" , authRoutes);
app.use("/api/users" , usersRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/module", moduleRoutes);
app.use("/api/video", videoRoutes);
app.use("/api/note", noteRoutes);
app.use("/api/text", textRoutes);
app.use("/api/questionary", questionaryRoutes);
app.use('/api/question' , questionRoutes);
app.use('/api/foro' , foroRoutes);
app.use('/api/question_foro' , questions_foroRoutes);
app.use('/api/response_foro' , response_foroRoutes);
app.use('/api/instructor' , instructorRoutes);
app.use('/api/response_questionary', response_questionaryRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/pay' , payRoutes);
app.use('/api/activecampaign' , activecampaign);
app.use('/api/objective' , objectiveRoutes);

app.use('/api/ticket' , ticketRoutes);
app.use('/api/paypal' , paypalRoutes);
app.use('/api/webpay' , webpayRoutes);

export default app;
