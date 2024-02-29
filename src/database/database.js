import Sequalize from 'sequelize'
import config from "../config.js";

export const sequelize =  new Sequalize(
    config.database,
    config.user,
    config.password,
      {
        host : config.host,
        dialect: "postgres",
        dialectOptions: {
            ssl: {
              require: true,
              rejectUnauthorized: false // solo si estás usando self-signed certificate
            }
        }
})