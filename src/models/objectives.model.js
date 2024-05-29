import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';


export const objective = sequelize.define('objetivos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    texto: {
        type: DataTypes.TEXT
    }
});