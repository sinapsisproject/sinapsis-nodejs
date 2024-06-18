import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/database.js'

import { orden_ticket } from '../../models/ticketera/orden_ticket.model.js'

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
    fecha_nacimiento: {
        type : DataTypes.DATE
    },
    pais: {
        type: DataTypes.STRING
    },
    rut_dni: {
        type: DataTypes.STRING
    },
    telefono: {
        type: DataTypes.STRING
    },
    ocupacion: {
        type: DataTypes.STRING
    },
    link_certificado: {
        type: DataTypes.TEXT
    },
    lugar_de_desempeño: {
        type: DataTypes.STRING
    }
});


usuarios_ticket.hasMany(orden_ticket, {
    foreignKey: 'id_usuario_ticket',
    sourceKey: 'id'
});

orden_ticket.belongsTo(usuarios_ticket , {
    foreignKey: 'id_usuario_ticket',
    targetId: 'id'
});



