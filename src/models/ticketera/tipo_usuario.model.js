import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/database.js';
import { caracteristica } from './../ticketera/caracteristica.model.js';
import { usuarios_ticket } from './../ticketera/usuarios_ticket.model.js';
import { pack } from './../ticketera/pack.model.js';
import { precio } from './precio.model.js';

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

tipo_usuario_ticket.hasMany(caracteristica, {
    as: 'car',
    foreignKey: 'id_tipo_usuario',
    sourceKey: 'id'
});

caracteristica.belongsTo(tipo_usuario_ticket, {
    as: 'tut',
    foreignKey: 'id_tipo_usuario',
    targetKey: 'id'
});

tipo_usuario_ticket.hasMany(usuarios_ticket, {
    as: 'ut',
    foreignKey: 'id_tipo_usuario',
    sourceKey: 'id'
});

usuarios_ticket.belongsTo(tipo_usuario_ticket, {
    as: 'tut',
    foreignKey: 'id_tipo_usuario',
    targetKey: 'id'
});

tipo_usuario_ticket.hasMany(pack, {
    as: 'pa',
    foreignKey: 'id_tipo_usuario',
    sourceKey: 'id'
});

pack.belongsTo(tipo_usuario_ticket, {
    as: 'tut',
    foreignKey: 'id_tipo_usuario',
    targetKey: 'id'
});

tipo_usuario_ticket.hasMany(precio, {
    as: 'pre',
    foreignKey: 'id_tipo_usuario',
    sourceKey: 'id'
});

precio.belongsTo(tipo_usuario_ticket, {
    as: 'tut',
    foreignKey: 'id_tipo_usuario',
    targetKey: 'id'
});