import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

import { question } from './question.model.js';

export const questionary = sequelize.define('cuestionario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING
    },
    descripcion: {
        type: DataTypes.TEXT
    },
    estado: {
        type: DataTypes.STRING
    },
    aprobacion : {
        type: DataTypes.FLOAT
    },
    ponderacion : {
        type: DataTypes.FLOAT
    },
    clase : {
        type: DataTypes.STRING
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
