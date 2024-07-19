// extramos el paquete 
// forma COMMONjs
// const express = require('express')
// importr modulos de forma MODULE
import express from 'express';
import usuariosRoutes from './routes/usuarioRoutes.js';
// llamamos a la funcion 
const app = express();
// .use sirve parr hacer configuraciones
app.set('view engine', 'pug');
app.set('views', './views');
// Carpeta publica
// para mostrrar archivos staicos como los estilos
app.use(express.static('public'));

// Routing
// .get -> busca la ruta especifica
// .use -> todas las ruta que inicien con el caracter '/'
app.use('/auth', usuariosRoutes);
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
const port = 3000;

app.listen(port, ()=>{
    console.log(`El servidor esta funcionando en: ${port}`);
});