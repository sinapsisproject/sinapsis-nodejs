import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

import { encuesta_pregunta } from './encuesta_pregunta.model.js';

export const encuesta = sequelize.define('encuesta', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING
    },
    texto: {
        type: DataTypes.TEXT
    },
    ubicacion: {
        type: DataTypes.INTEGER
    },
    estado: {
        type: DataTypes.STRING
    }
});


encuesta.hasMany(encuesta_pregunta, {
    foreignKey: 'id_encuesta',
    sourceKey: 'id'
});

encuesta_pregunta.belongsTo(encuesta , {
    foreignKey: 'id_encuesta',
    targetId: 'id'
});
