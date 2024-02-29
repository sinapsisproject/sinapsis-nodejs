import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';


export const address = sequelize.define('direccion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    calle: {
        type: DataTypes.STRING
    },
    numero: {
        type: DataTypes.INTEGER
    },
    depto: {
        type: DataTypes.STRING()
    }
});

