import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/database.js'

import { item_ticket } from '../../models/ticketera/item_ticket.model.js';

export const orden_ticket = sequelize.define('orden_ticket', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_medico: {
        type: DataTypes.INTEGER
    },
    total: {
        type: DataTypes.INTEGER
    },
    fecha: {
        type : DataTypes.DATE
    },
    medio_pago: {
        type: DataTypes.STRING
    },
    plataforma_pago: {
        type: DataTypes.STRING
    }
});


orden_ticket.hasMany(item_ticket, {
    foreignKey: 'id_orden_ticket',
    sourceKey: 'id'
});

item_ticket.belongsTo(orden_ticket , {
    foreignKey: 'id_orden_ticket',
    targetId: 'id'
});


