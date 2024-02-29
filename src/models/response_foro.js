import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

export const response_foro = sequelize.define('respuestas_foro', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    entrada: {
        type: DataTypes.TEXT
    },
    id_usuario: {
        type: DataTypes.INTEGER
    }
});
