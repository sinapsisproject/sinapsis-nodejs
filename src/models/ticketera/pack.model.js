import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/database.js';
import { unidades } from './../ticketera/unidades.model.js';

export const pack = sequelize.define('pack', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
});

pack.hasMany(unidades, {
    as: 'ud',
    foreignKey: 'id_pack',
    sourceKey: 'id'
});

unidades.belongsTo(pack, {
    as: 'pa',
    foreignKey: 'id_pack',
    targetKey: 'id'
});

