import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';


export const user_course = sequelize.define('usuario_curso', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    estado: {
        type: DataTypes.STRING
    }
});
