import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

import { response_questionary } from './response_questionary.model.js';


export const alternative = sequelize.define('alternativa', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    alternativa: {
        type: DataTypes.TEXT
    },
    opcion: {
        type: DataTypes.STRING
    }
});


alternative.hasMany(response_questionary, {
    foreignKey: 'id_alternativa',
    sourceKey: 'id'
});

response_questionary.belongsTo(alternative , {
    foreignKey: 'id_alternativa',
    targetId: 'id'
});

