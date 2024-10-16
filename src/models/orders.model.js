import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';


export const order = sequelize.define('ordenes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_usuario: {
        type: DataTypes.INTEGER
    },
    id_curso: {
        type: DataTypes.INTEGER
    },
    estado: {
        type: DataTypes.STRING
    },
    moneda: {
        type: DataTypes.STRING
    },
    total: {
        type: DataTypes.FLOAT
    },
    fecha : {
        type: DataTypes.DATE
    }
});