import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';


export const response_questionary = sequelize.define('respuesta_cuestionario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_alternativa: {
        type: DataTypes.INTEGER
    },
    id_usuario: {
        type: DataTypes.INTEGER
    }
});
