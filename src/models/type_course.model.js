import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import { course } from './course.model.js';

export const type_course = sequelize.define('tipo_curso', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING
    },
    descripcion: {
        type: DataTypes.TEXT
    }
},
{
    timestamps: false
});

type_course.hasMany(course, {
    foreignKey: 'id_tipo_curso',
    sourceKey: 'id'
});

course.belongsTo(type_course , {
    foreignKey: 'id_tipo_curso',
    targetId: 'id'
});

