import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

import { module } from './module.model.js';
import { user_course } from './user_course.model.js';
import { order } from './orders.model.js';
 

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
    descripcion_corta: {
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
    },
    imagen: {
        type: DataTypes.TEXT
    },
    precio: {
        type: DataTypes.INTEGER
    },
    objetivo: {
        type: DataTypes.TEXT
    },
    duracion : {
        type: DataTypes.STRING
    },
    segmento : {
        type: DataTypes.TEXT
    },
    estudiantes : {
        type: DataTypes.TEXT
    },
    nota_aprobacion : {
        type: DataTypes.FLOAT
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


course.hasMany(order, {
    foreignKey: 'id_curso',
    sourceKey: 'id'
});

order.belongsTo(course , {
    foreignKey: 'id_curso',
    targetId: 'id'
});


