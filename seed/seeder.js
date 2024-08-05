import { exit } from 'node:process';
import categorias from './categorias.js';
import precios from './precios.js';
// sin relaciones
// import Categoria from '../models/Categoria.js';
// import Precio from '../models/Precio.js';
// relaciones
import { Categoria, Precio } from '../models/index.js';
import db from '../config/db.js';

const importarDatos = async() => {
    try {
        // Autenticar
        await db.authenticate();
        // Generar columnas
        await db.sync();
        // Importar datos
        // utilizar awit cuando no dependen una de la otra sino utiliza
        // Promise
        // await Categoria.bulkCreate(categorias);
        // console.log('Importacion de categorias correcto');
        // await Precio.bulkCreate(precios);
        // console.log('Importacion de precios correcto');
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios)
        ]);
        // Termina el procesos SIN erroes 0 o vacio
        exit();

    } catch (error) {
        console.log(error);
        // Termina el procesos CON erroes
        exit(1);
    }
}
const eliminarDatos = async () => {
    try {
        // await Promise.all([
        //     Categoria.destroy({ where : {}, truncate: true}),
        //     Precio.destroy({ where : {}, truncate: true})
        // ]);
        // Segunda forma para eliminar datos
        await db.sync({ force: true});
        exit();
    } catch (error) {
        console.log(error);
        exit(1);
    }
}
if(process.argv[2] === '-i'){
    importarDatos();
}
if(process.argv[2] === '-e'){
    eliminarDatos();
}
// export default importarDatos