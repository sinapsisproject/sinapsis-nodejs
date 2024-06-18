import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/database.js'

export const precio = sequelize.define('precio', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_precio: {
        type: DataTypes.STRING
    },
    valor: {
        type: DataTypes.INTEGER
    },
    estado: {
        type : DataTypes.INTEGER
    }
});
