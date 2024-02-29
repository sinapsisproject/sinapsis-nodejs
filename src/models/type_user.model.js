import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import { user } from './user.model.js';

export const type_user = sequelize.define('tipo_usuario', {
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
});


// (async () => {
//     try {

//       await type_user.destroy({
//         where: {}, // Especificamos un objeto vacío para seleccionar todos los registros
//         truncate: false // Indicamos que queremos truncar (eliminar) todos los registros en lugar de realizar una eliminación en cascada
//       });

//       const nuevoTipo = await type_user.create({
//         nombre: 'activo',
//         descripcion: 'Usuario habilitado para hacer login en la plataforma'
//       });
//       console.log('Nuevo usuario creado:', nuevoTipo.toJSON());
//     } catch (error) {
//       console.error('Error al insertar usuario:', error);
//     }
//   })();




type_user.hasMany(user, {
    foreignKey: 'id_tipo_usuario',
    sourceKey: 'id'
});

user.belongsTo(type_user , {
    foreignKey: 'id_tipo_usuario',
    targetId: 'id'
});
