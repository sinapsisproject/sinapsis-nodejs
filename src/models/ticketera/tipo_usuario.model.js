import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/database.js'

import { tipo_producto_ticket } from './../ticketera/tipo_producto.model.js';
import { usuarios_ticket } from './../ticketera/usuarios_ticket.model.js';

export const tipo_usuario_ticket = sequelize.define('tipo_usuario_ticket', {
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


tipo_usuario_ticket.hasMany(tipo_producto_ticket, {
    foreignKey: 'id_tipo_usuario_ticket',
    sourceKey: 'id'
});

tipo_producto_ticket.belongsTo(tipo_usuario_ticket , {
    foreignKey: 'id_tipo_usuario_ticket',
    targetId: 'id'
});

tipo_usuario_ticket.hasMany(usuarios_ticket, {
    foreignKey: 'id_tipo_usuario_ticket',
    sourceKey: 'id'
});

usuarios_ticket.belongsTo(tipo_usuario_ticket , {
    foreignKey: 'id_tipo_usuario_ticket',
    targetId: 'id'
});

