import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/database.js';

export const unidades = sequelize.define('unidades', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
});

