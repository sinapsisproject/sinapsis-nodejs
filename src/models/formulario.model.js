import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

import { pregunta_formulario } from './pregunta_formulario.model.js';

export const formulario = sequelize.define('formulario', {
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


formulario.hasMany(pregunta_formulario, {
    foreignKey: 'id_formulario',
    sourceKey: 'id'
});

pregunta_formulario.belongsTo(formulario , {
    foreignKey: 'id_formulario',
    targetId: 'id'
});
