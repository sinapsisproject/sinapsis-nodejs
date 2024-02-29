import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

import { address } from '../models/address.model.js';

export const comuna = sequelize.define('comuna', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING
    }
});


comuna.hasMany(address, {
    foreignKey: 'id_comuna',
    sourceKey: 'id'
});

address.belongsTo(comuna , {
    foreignKey: 'id_comuna',
    targetId: 'id'
});