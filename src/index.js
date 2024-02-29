import app from "./app.js";
import { sequelize } from "./database/database.js";


import './models/type_course.model.js';
import './models/course.model.js';
import './models/module.model.js';
import './models/video.model.js';
import './models/text.model.js';
import './models/questionary.model.js';
import './models/question.model.js';
import './models/type_user.model.js';
import './models/user.model.js';
import './models/address.model.js';
import './models/comuna.model.js';
import './models/region.model.js';
import './models/user_course.model.js';

const main=async ()=>{
    try {
        ////await sequelize.sync({alter: true});
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
        app.listen(app.get("port"));
        console.log(`Server on port ${app.get("port")}`);
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

main();