import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/database.js';
import { caracteristica } from '../../models/ticketera/caracteristica.model.js';
import { pack } from '../../models/ticketera/pack.model.js';

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
    }
});

tipo_producto_ticket.hasMany(caracteristica, {
    as: 'car',
    foreignKey: 'id_tipo_producto',
    sourceKey: 'id'
});

caracteristica.belongsTo(tipo_producto_ticket, {
    as: 'tpt',
    foreignKey: 'id_tipo_producto',
    targetKey: 'id'
});

tipo_producto_ticket.hasMany(pack, {
    as: 'pa',
    foreignKey: 'id_tipo_producto',
    sourceKey: 'id'
});

pack.belongsTo(tipo_producto_ticket, {
    as: 'tpt',
    foreignKey: 'id_tipo_producto',
    targetKey: 'id'
});




