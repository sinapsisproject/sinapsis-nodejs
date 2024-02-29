import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

import { questions_foro } from './questions_foro.model.js';

export const foro = sequelize.define('foro', {
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
    descripcion: {
        type: DataTypes.TEXT
    },
    ubicacion : {
        type: DataTypes.INTEGER
    }
});


foro.hasMany(questions_foro, {
    foreignKey: 'id_foro',
    sourceKey: 'id'
});

questions_foro.belongsTo(foro , {
    foreignKey: 'id_foro',
    targetId: 'id'
});