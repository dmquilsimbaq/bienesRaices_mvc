import { Sequelize } from "sequelize";
// importar las variables de entorno
import dotenv from 'dotenv';
dotenv.config({path: '.env'});
const db = new Sequelize (process.env.BD_NOMBRE, process.env.BD_USER, process.env.BD_PASS ?? '', {
    host: process.env.localhost,
    port: 3306,
    dialect: 'mysql',
    // creacion de dos tablas adicionales 
    // al crear registro de usaurios 
    define:{
        timestamps: true
    },
    // comportamiento de conecionoes nuevas o existentes 
    pool:{
        // maximo 5 conecciones a mantener 
        max: 5,
        // minimo 0 conecciones a mantener 
        min: 0,
        //  tiempo de tratatr de hacer una coneccion y resivir una respuesta 
        acquire: 30000,
        // tiempo que tienes que transcurri para finalizar la coneccion a la base de datos
        idle: 10000
    },
    // para versiones antiguas 
    // y que no se utilice aqui
    // operatorsAliases: false
});

export default db