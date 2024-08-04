import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

export const encuesta_respuesta = sequelize.define('encuesta_respuesta', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    respuesta: {
        type: DataTypes.TEXT
    }
});
