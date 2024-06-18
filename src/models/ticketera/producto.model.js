import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/database.js'

import { pack } from '../../models/ticketera/pack.model.js'
import { precio } from '../../models/ticketera/precio.model.js'

export const producto_ticket = sequelize.define('producto_ticket', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING
    },
    estado: {
        type: DataTypes.STRING
    }
});


producto_ticket.hasMany(pack, {
    foreignKey: 'id_producto_ticket',
    sourceKey: 'id'
});

pack.belongsTo(producto_ticket , {
    foreignKey: 'id_producto_ticket',
    targetId: 'id'
});


producto_ticket.hasMany(precio, {
    foreignKey: 'id_producto_ticket',
    sourceKey: 'id'
});

precio.belongsTo(producto_ticket , {
    foreignKey: 'id_producto_ticket',
    targetId: 'id'
});


