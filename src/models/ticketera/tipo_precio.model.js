import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/database.js';

import { precio } from './precio.model.js';

export const tipo_precio = sequelize.define('tipo_precio', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_precio: {
        type: DataTypes.STRING
    },
    estado: {
        type : DataTypes.STRING
    }
});


tipo_precio.hasMany(precio, {
    as: 'pre',
    foreignKey: 'id_tipo_precio',
    sourceKey: 'id'
});

precio.belongsTo(tipo_precio, {
    as: 'tpre',
    foreignKey: 'id_tipo_precio',
    targetKey: 'id'
});