import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/database.js'


export const item_ticket = sequelize.define('item_ticket', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cantidad: {
        type: DataTypes.INTEGER
    },
    id_producto: {
        type : DataTypes.INTEGER
    },
    nombre_producto: {
        type: DataTypes.STRING
    },
    precio : {
        type :DataTypes.INTEGER
    }
});

