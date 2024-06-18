import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/database.js'


export const pack = sequelize.define('pack', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
});

