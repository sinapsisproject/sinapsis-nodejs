import Sequalize from 'sequelize'
import debug from 'debug';
import config from "../config.js";

const debugSequelize = debug('sequelize');


export const sequelize = new Sequalize({
  dialect: 'postgres',
  host: config.host,
  port: config.port_bd,
  username: config.user,
  password: config.password,
  database: config.database,
  logging: true
});