import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';


export const text = sequelize.define('texto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: DataTypes.STRING
    },
    texto: {
        type: DataTypes.TEXT
    },
    ubicacion: {
        type: DataTypes.INTEGER
    },
    estado : {
        type: DataTypes.STRING
    }
});