import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/database.js'

import { orden_ticket } from '../../models/ticketera/orden_ticket.model.js'
import { pack } from './pack.model.js';

export const usuarios_ticket = sequelize.define('usuarios_ticket', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING
    },
    apellido: {
        type: DataTypes.STRING
    },
    correo_electronico: {
        type : DataTypes.STRING
    },
    fecha_nacimiento: {
        type: DataTypes.DATE
    },
    id_pais: {
        type: DataTypes.INTEGER
    },
    telefono: {
        type: DataTypes.STRING
    },
    ocupacion: {
        type: DataTypes.STRING
    },
    lugar_de_desempeño: {
        type: DataTypes.STRING
    }
    
});


usuarios_ticket.hasMany(orden_ticket, {
    as: 'ot',
    foreignKey: 'id_usuario',
    sourceKey: 'id'
});

orden_ticket.belongsTo(usuarios_ticket , {
    as: 'ot',
    foreignKey: 'id_usuario',
    targetId: 'id'
});


