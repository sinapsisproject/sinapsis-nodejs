import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/database.js'

export const paypalTransactionLog = sequelize.define('paypalTransactionLog', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    action: {
        type: DataTypes.STRING,
    },
    id_usuario: {
        type: DataTypes.INTEGER
    },
    id_orden: {
        type: DataTypes.INTEGER
    },
    token: {
        type : DataTypes.STRING
    },
    payid: {
        type : DataTypes.STRING
    },
    cart: {
        type : DataTypes.STRING
    },
    payerid: {
        type : DataTypes.STRING
    },
    country_code: {
        type : DataTypes.STRING
    },
    monto: {
        type : DataTypes.STRING
    },
});