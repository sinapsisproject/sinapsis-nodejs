import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import { course } from './course.model.js';

export const type_course = sequelize.define('tipo_curso', {
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

//       await type_course.destroy({
//         where: {}, // Especificamos un objeto vacío para seleccionar todos los registros
//         truncate: false // Indicamos que queremos truncar (eliminar) todos los registros en lugar de realizar una eliminación en cascada
//       });

//       const nuevoTipoCurso = await type_course.create({
//         nombre: 'Pagado',
//         descripcion: 'Cursos habilitados para usuarios premium con suscripción al día'
//       });
//       console.log('Nuevo curso creado:', nuevoTipoCurso.toJSON());
//     } catch (error) {
//       console.error('Error al insertar curso:', error);
//     }
//   })();



type_course.hasMany(course, {
    foreignKey: 'id_tipo_curso',
    sourceKey: 'id'
});

course.belongsTo(type_course , {
    foreignKey: 'id_tipo_curso',
    targetId: 'id'
});


