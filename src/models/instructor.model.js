import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

import { course } from './course.model.js';

export const instructor = sequelize.define('instructor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING
    },
    especialidad: {
        type: DataTypes.STRING
    },
    cargo: {
        type: DataTypes.STRING
    },
    descripcion: {
        type: DataTypes.TEXT
    },
    foto: {
        type: DataTypes.TEXT
    }
});


instructor.hasMany(course, {
    foreignKey: 'id_instructor',
    sourceKey: 'id'
});

course.belongsTo(instructor , {
    foreignKey: 'id_instructor',
    targetId: 'id'
});
