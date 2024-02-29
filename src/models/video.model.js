import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';


export const video = sequelize.define('video', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING
    },
    link_video: {
        type: DataTypes.STRING(500)
    },
    descripcion: {
        type: DataTypes.TEXT
    },
    ubicacion: {
        type: DataTypes.INTEGER
    },
    estado : {
        type: DataTypes.STRING
    }
});

// video.hasMany(module, {
//     foreignKey: 'id_modulo',
//     sourceKey: 'id'
// });

// module.belongsTo(video , {
//     foreignKey: 'id_modulo',
//     targetId: 'id'
// });