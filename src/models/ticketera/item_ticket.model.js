import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/database.js'


export const item_ticket = sequelize.define('item_ticket', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_tipo_producto: {
        type: DataTypes.INTEGER
    },
    nombre_tipo_producto: {
        type: DataTypes.STRING
    },
    id_producto: {
        type : DataTypes.INTEGER
    },
    nombre_producto: {
        type: DataTypes.STRING
    }
});

