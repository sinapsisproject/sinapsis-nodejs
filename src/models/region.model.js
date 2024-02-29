import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import { comuna } from './comuna.model.js';

export const region = sequelize.define('region', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING
    },
    numero: {
        type: DataTypes.INTEGER
    }
});

region.hasMany(comuna, {
    foreignKey: 'id_region',
    sourceKey: 'id'
});

comuna.belongsTo(region , {
    foreignKey: 'id_region',
    targetId: 'id'
});
