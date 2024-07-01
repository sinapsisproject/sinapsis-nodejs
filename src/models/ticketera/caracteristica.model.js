import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/database.js';

export const caracteristica = sequelize.define('caracteristica', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cant_curso_online: {
        type: DataTypes.INTEGER
    },
    cant_curso_presencial: {
        type: DataTypes.INTEGER
    }
});

