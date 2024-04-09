import Sequalize from 'sequelize'
import config from "../config.js";

export const sequelize = new Sequalize({
  dialect: 'postgres',
  host: config.host,
  port: config.port_bd,
  username: config.user,
  password: config.password,
  database: config.database,
  logging: false
});