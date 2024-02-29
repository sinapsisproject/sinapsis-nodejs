import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

import { question } from './question.model.js';

export const questionary = sequelize.define('cuestionario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: DataTypes.STRING
    },
    descripcion: {
        type: DataTypes.TEXT
    },
    estado: {
        type: DataTypes.STRING
    },
    aprovacion : {
        type: DataTypes.FLOAT
    },
    tiempo : {
        type: DataTypes.INTEGER
    },
    ubicacion : {
        type: DataTypes.FLOAT
    }
});


questionary.hasMany(question, {
    foreignKey: 'id_cuestionario',
    sourceKey: 'id'
});

question.belongsTo(questionary , {
    foreignKey: 'id_cuestionario',
    targetId: 'id'
});
