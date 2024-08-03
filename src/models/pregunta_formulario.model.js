import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

import { respuesta_formulario } from './respuesta_formulario.model.js';

export const pregunta_formulario = sequelize.define('pregunta_formulario', {
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


pregunta_formulario.hasMany(respuesta_formulario, {
    foreignKey: 'id_pregunta_formulario',
    sourceKey: 'id'
});

respuesta_formulario.belongsTo(pregunta_formulario , {
    foreignKey: 'id_pregunta_formulario',
    targetId: 'id'
});


