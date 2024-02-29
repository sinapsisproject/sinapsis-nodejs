import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';


export const note = sequelize.define('apunte', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING
    },
    link_apunte: {
        type: DataTypes.STRING(500)
    },
    descripcion: {
        type: DataTypes.TEXT
    },
    ubicacion: {
        type: DataTypes.INTEGER
    },
    estado : {
        type: DataTypes.STRING
    }
});