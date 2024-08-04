import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

import { encuesta_alternativa } from './encuesta_alternativa.model.js';

export const encuesta_pregunta = sequelize.define('encuesta_pregunta', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    pregunta: {
        type: DataTypes.TEXT
    },
    tipo: {
        type: DataTypes.STRING
    },
    estado: {
        type: DataTypes.STRING
    }
});


encuesta_pregunta.hasMany(encuesta_alternativa, {
    foreignKey: 'id_encuesta_pregunta',
    sourceKey: 'id'
});

encuesta_alternativa.belongsTo(encuesta_pregunta , {
    foreignKey: 'id_encuesta_pregunta',
    targetId: 'id'
});
