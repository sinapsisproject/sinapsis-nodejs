import { DataTypes, INTEGER } from 'sequelize';
import { sequelize } from '../database/database.js';

import { video } from './video.model.js';
import { note } from './note.model.js';
import { text } from './text.model.js';
import { questionary } from './questionary.model.js';
import { foro } from './foro.model.js';
import { objective } from './objectives.model.js';
import { formulario } from './formulario.model.js';
import { encuesta } from './encuesta.model.js';

export const module = sequelize.define('modulo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING
    },
    estado: {
        type: DataTypes.STRING
    },
    ubicacion : {
        type: DataTypes.INTEGER
    }
});

module.hasMany(video, {
    foreignKey: 'id_modulo',
    sourceKey: 'id'
});

video.belongsTo(module , {
    foreignKey: 'id_modulo',
    targetId: 'id'
});

module.hasMany(note, {
    foreignKey: 'id_modulo',
    sourceKey: 'id'
});

note.belongsTo(module , {
    foreignKey: 'id_modulo',
    targetId: 'id'
});

module.hasMany(text, {
    foreignKey: 'id_modulo',
    sourceKey: 'id'
});

text.belongsTo(module , {
    foreignKey: 'id_modulo',
    targetId: 'id'
});

module.hasMany(questionary, {
    foreignKey: 'id_modulo',
    sourceKey: 'id'
});

questionary.belongsTo(module , {
    foreignKey: 'id_modulo',
    targetId: 'id'
});

module.hasMany(foro, {
    foreignKey: 'id_modulo',
    sourceKey: 'id'
});

foro.belongsTo(module , {
    foreignKey: 'id_modulo',
    targetId: 'id'
});

module.hasMany(objective, {
    foreignKey: 'id_modulo',
    sourceKey: 'id'
});

objective.belongsTo(module , {
    foreignKey: 'id_modulo',
    targetId: 'id'
});

module.hasMany(formulario, {
    foreignKey: 'id_modulo',
    sourceKey: 'id'
});

formulario.belongsTo(module , {
    foreignKey: 'id_modulo',
    targetId: 'id'
});

module.hasMany(encuesta, {
    foreignKey: 'id_modulo',
    sourceKey: 'id'
});

encuesta.belongsTo(module , {
    foreignKey: 'id_modulo',
    targetId: 'id'
});