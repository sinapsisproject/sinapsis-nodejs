import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';


export const progress = sequelize.define('avance', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_item: {
        type: DataTypes.INTEGER
    },
    nombre_item: {
        type: DataTypes.STRING
    }
});