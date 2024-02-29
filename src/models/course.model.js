import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

import { module } from './module.model.js';
import { user_course } from './user_course.model.js';

export const course = sequelize.define('curso', {
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
    },
    link_video: {
        type: DataTypes.STRING(500)
    },
    link_programa: {
        type: DataTypes.STRING(500)
    },
    estado: {
        type: DataTypes.STRING
    }
});

course.hasMany(module, {
    foreignKey: 'id_curso',
    sourceKey: 'id'
});

module.belongsTo(course , {
    foreignKey: 'id_curso',
    targetId: 'id'
});

course.hasMany(user_course, {
    foreignKey: 'id_curso',
    sourceKey: 'id'
});

user_course.belongsTo(course , {
    foreignKey: 'id_curso',
    targetId: 'id'
});



