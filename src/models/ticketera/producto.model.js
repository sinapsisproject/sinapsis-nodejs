import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/database.js';
import { unidades } from './unidades.model.js';
import { precio } from './precio.model.js'; 

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

producto_ticket.hasMany(unidades, {
    as: 'ud',
    foreignKey: 'id_producto',
    sourceKey: 'id'
});

unidades.belongsTo(producto_ticket, {
    as: 'pt',
    foreignKey: 'id_producto',
    targetKey: 'id'
});

producto_ticket.hasMany(precio, {
    as: 'pre',
    foreignKey: 'id_producto',
    sourceKey: 'id'
});

precio.belongsTo(producto_ticket, {
    as: 'pt',
    foreignKey: 'id_producto',
    targetKey: 'id'
});
