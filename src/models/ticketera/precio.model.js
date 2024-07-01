import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/database.js'

export const precio = sequelize.define('precio', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    valor: {
        type: DataTypes.INTEGER
    }
});
