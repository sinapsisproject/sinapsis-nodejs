import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/database.js'

import { item_ticket } from '../../models/ticketera/item_ticket.model.js';

export const orden_ticket = sequelize.define('orden_ticket', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_tipo_usuario: {
        type: DataTypes.INTEGER
    },
    subtotal: {
        type: DataTypes.FLOAT
    },
    total:{
        type: DataTypes.FLOAT
    },
    total_dolares:{
        type: DataTypes.FLOAT
    },
    estado: {
        type: DataTypes.STRING
    },
    descuento: {
        type: DataTypes.INTEGER
    },
    nombre_descuento: {
        type: DataTypes.STRING
    },
    fecha: {
        type : DataTypes.DATE
    },
    medio_pago: {
        type: DataTypes.STRING
    },
    plataforma_pago: {
        type: DataTypes.STRING
    },
    id_usuario_sinapsis: {
        type: DataTypes.INTEGER
    }
});


orden_ticket.hasMany(item_ticket, {
    as: 'it',
    foreignKey: 'id_orden_ticket',
    sourceKey: 'id'
});

item_ticket.belongsTo(orden_ticket , {
    as: 'ot',
    foreignKey: 'id_orden_ticket',
    targetId: 'id'
});


