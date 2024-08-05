// extramos el paquete -> forma COMMONjs => const express = require('express')
// importr modulos de forma MODULE
import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
// archivos creaos por mi utilizar ubicacion dde la carpeta mas .js
import usuariosRoutes from './routes/usuarioRoutes.js';
import propiedadRoutes from './routes/propiedadRoutes.js';
import db from './config/db.js'

// llamamos a la funcion 
const app = express();
// habilitar la lectura de datos del formulario
app.use( express.urlencoded({extended: true}) )
// Habilitar cookie paarser
app.use(cookieParser());
// Habilitar CSURF
app.use(csrf({ cookie: true }));
// Conneccion a la Base de datos
try {
    // autenticar la coneccion a la base de datos
    await db.authenticate();
    // va a sincronizar las tablas en caso de que no hay las crea 
    db.sync();
    // console.log('Coneccion correcta a la base de datos');
} catch (error) {
    console.log(error);
}
// .use sirve parr hacer configuraciones
app.set('view engine', 'pug');
app.set('views', './views');
// Carpeta publica => para mostrrar archivos staicos como los estilos
app.use(express.static('public'));

// Routing
// .get -> busca la ruta especifica
// .use -> todas las ruta que inicien con el caracter '/'
app.use('/auth', usuariosRoutes);
app.use('/', propiedadRoutes);
// 
// app.get('/', function(req, res){
//     // req -> es la infomracion que envio desde el navegador
//     // res -> respuesta enviada  desde el proyeecto
//     // send -> envia repuesta de tipo texto plano
//     // json -> envio un objeto
//     // render -> para enviar una vista una pagina web
//     res.send('Bienvenido')
//     console.log('peticion inicial')
// });
///
/// Definir un puerto y arrancar el proyecto
const port = process.env.PORT || 3000; 
app.listen(port, ()=>{
    // console.log(`El servidor esta funcionando en: ${port}`);
});