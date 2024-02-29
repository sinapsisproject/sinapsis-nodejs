import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';


export const alternative = sequelize.define('alternativa', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    alternativa: {
        type: DataTypes.TEXT
    },
    opcion: {
        type: DataTypes.STRING
    }
});