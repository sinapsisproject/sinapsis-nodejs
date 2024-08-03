import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

import { address } from '../models/address.model.js';
import { user_course } from './user_course.model.js';
import { response_questionary } from './response_questionary.model.js';
import { progress } from './progress.model.js';
import { order } from './orders.model.js';
import { respuesta_formulario } from './respuesta_formulario.model.js'; 

export const user = sequelize.define('usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING
    },
    username: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    fecha_nacimiento: {
        type: DataTypes.DATE
    },
    telefono: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    estado: {
        type: DataTypes.STRING
    }
});

user.hasMany(address, {
    foreignKey: 'id_usuario',
    sourceKey: 'id'
});

address.belongsTo(user , {
    foreignKey: 'id_usuario',
    targetId: 'id'
});

user.hasMany(user_course, {
    foreignKey: 'id_usuario',
    sourceKey: 'id'
});

user_course.belongsTo(user , {
    foreignKey: 'id_usuario',
    targetId: 'id'
});

user.hasMany(response_questionary, {
    foreignKey: 'id_usuario',
    sourceKey: 'id'
});

response_questionary.belongsTo(user , {
    foreignKey: 'id_usuario',
    targetId: 'id'
});

user.hasMany(progress, {
    foreignKey: 'id_usuario',
    sourceKey: 'id'
});

progress.belongsTo(user , {
    foreignKey: 'id_usuario',
    targetId: 'id'
});

user.hasMany(order, {
    foreignKey: 'id_usuario',
    sourceKey: 'id'
});

order.belongsTo(user , {
    foreignKey: 'id_usuario',
    targetId: 'id'
});

user.hasMany(respuesta_formulario, {
    foreignKey: 'id_usuario',
    sourceKey: 'id'
});

respuesta_formulario.belongsTo(user , {
    foreignKey: 'id_usuario',
    targetId: 'id'
});






