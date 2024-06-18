import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/database.js'

import { pack } from '../../models/ticketera/pack.model.js'

export const tipo_producto_ticket = sequelize.define('tipo_producto_ticket', {
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
    },
    cant_curso_presencial: {
        type : DataTypes.INTEGER
    },
    cant_curso_online: {
        type: DataTypes.INTEGER
    }
});


tipo_producto_ticket.hasMany(pack, {
    foreignKey: 'id_tipo_producto_ticket',
    sourceKey: 'id'
});

pack.belongsTo(tipo_producto_ticket , {
    foreignKey: 'id_tipo_producto_ticket',
    targetId: 'id'
});




