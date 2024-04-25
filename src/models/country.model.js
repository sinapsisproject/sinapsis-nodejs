import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

import { user } from './user.model.js';

export const pais = sequelize.define('pais', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING
    }
});


pais.hasMany(user, {
    foreignKey: 'id_pais',
    sourceKey: 'id'
});

user.belongsTo(pais, {
    foreignKey: 'id_pais',
    targetId: 'id'
});