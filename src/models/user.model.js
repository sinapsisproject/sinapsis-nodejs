import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

import { address } from '../models/address.model.js';
import { user_course } from './user_course.model.js';

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
