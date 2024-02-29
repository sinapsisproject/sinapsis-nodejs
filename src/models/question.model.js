import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

import { alternative } from './alternativa.model.js';

export const question = sequelize.define('pregunta', {
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
    justificacion: {
        type: DataTypes.TEXT
    }
});


question.hasMany(alternative, {
    foreignKey: 'id_pregunta',
    sourceKey: 'id'
});

alternative.belongsTo(question , {
    foreignKey: 'id_pregunta',
    targetId: 'id'
});
