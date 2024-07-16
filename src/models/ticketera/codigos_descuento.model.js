import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/database.js'

import { orden_ticket } from '../../models/ticketera/orden_ticket.model.js'


export const codigo_descuento = sequelize.define('codigo_descuento', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    codigo: {
        type: DataTypes.STRING
    },
    descuento: {
        type: DataTypes.INTEGER
    },
    unidades: {
        type : DataTypes.INTEGER
    }
});


codigo_descuento.hasMany(orden_ticket, {
    as: 'ot',
    foreignKey: 'id_codigo_descuento',
    sourceKey: 'id'
});

orden_ticket.belongsTo(codigo_descuento, {
    as: 'code',
    foreignKey: 'id_codigo_descuento',
    targetKey: 'id'
});