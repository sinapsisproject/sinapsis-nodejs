import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

export const respuesta_formulario = sequelize.define('respuesta_formulario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    respuesta: {
        type: DataTypes.TEXT
    }
});