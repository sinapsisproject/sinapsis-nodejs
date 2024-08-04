import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

import { encuesta_respuesta } from './encuesta_respuesta.model.js';

export const encuesta_alternativa = sequelize.define('encuesta_alternativa', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    alternativa: {
        type: DataTypes.TEXT
    }
});


encuesta_alternativa.hasMany(encuesta_respuesta, {
    foreignKey: 'id_encuesta_alternativa',
    sourceKey: 'id'
});

encuesta_respuesta.belongsTo(encuesta_alternativa , {
    foreignKey: 'id_encuesta_alternativa',
    targetId: 'id'
});
