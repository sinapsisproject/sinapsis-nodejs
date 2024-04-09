import Sequalize from 'sequelize'
import config from "../config.js";

// export const sequelize =  new Sequalize(
//     config.database,
//     config.user,
//     config.password,
//       {
//         host : config.host,
//         dialect: "postgres",
//         dialectOptions: {
//             ssl: {
//               require: true,
//               rejectUnauthorized: false // solo si estás usando self-signed certificate
//             }
//         }
// })


export const sequelize = new Sequalize({
  dialect: 'postgres',
  host: config.host,
  port: config.port_bd,
  username: config.user,
  password: config.password,
  database: config.database,
  logging: false // Opcional: deshabilita los registros de consultas SQL
});