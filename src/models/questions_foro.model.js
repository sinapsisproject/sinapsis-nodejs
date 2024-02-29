import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

import { response_foro } from './response_foro.js';


export const questions_foro = sequelize.define('preguntas_foro', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    entrada: {
        type: DataTypes.TEXT
    },
    id_usuario: {
        type: DataTypes.INTEGER
    }
});


questions_foro.hasMany(response_foro, {
    foreignKey: 'id_pregunta',
    sourceKey: 'id'
});

response_foro.belongsTo(questions_foro , {
    foreignKey: 'id_pregunta',
    targetId: 'id'
});