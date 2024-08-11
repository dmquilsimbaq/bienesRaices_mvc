import { validationResult } from 'express-validator';
import { unlink } from 'node:fs/promises';
// import Categoria from '../models/Categoria.js'
// import Precio from '../models/Precio.js'
import { Propiedad, Categoria, Precio, Usuario } from '../models/index.js';

const admin = async (req, res) => {
    const { id } = req.usuario;
    const propiedades = await Propiedad.findAll({
        where:{
            usuarioId: id
        },
        // realizar un join para traer datos de otras tablas
        include: [
            { model: Categoria, as: 'categoria' },
            { model: Precio, as: 'precio' }
        ]
    });
    res.render('propiedades/admin', {
        pagina: 'Mis propiedades',
        propiedades,
        csrfToken: req.csrfToken(),
    })
}
const crear = async (req, res) => {

    // Consultar modelos Categoris y Precios
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ]);
    res.render('propiedades/crear',{
        pagina: 'Crear Propiedad',
        csrfToken: req.csrfToken(),
       
        categorias,
        precios,
        datos: {}
    });
}
const guardar = async (req, res) => {
    // Validacion
    let resultado = validationResult(req);
    if(!resultado.isEmpty()){
        // Consultamos precios y categorias
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ]);
        return  res.render('propiedades/crear',{
            pagina: 'Crear Propiedad', 
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        });
    }
    console.log(req.body.categoria);
    
    const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId , categoria: categoriaId  } = req.body;
    
    const { id: usuarioId } = req.usuario;
    
    try {
        const PropiedadGuardar = await Propiedad.create({
            titulo, 
            descripcion, 
            habitaciones, 
            estacionamiento, 
            wc, 
            calle, 
            lat, 
            lng, 
            precioId, 
            categoriaId,
            usuarioId,
            imagen: ''
        });
        const { id } = PropiedadGuardar;
        res.redirect(`/propiedades/agregar_imagen/${id}`);
    } catch (error) {
        console.log(error);
    }
}
const agregarImagen = async (req, res) => {
    const { id } = req.params;
    // validar propiedada existente 
    const propiedad = await Propiedad.findByPk(id);
    if(!propiedad){
        return res.redirect('/mis_propiedades');
    }
    // validar propiedad que no este publicada
    if(propiedad.publicado){
        return res.redirect('/mis_propiedades');
    }
    // valida propieda sea del usuario
    // usar toString para mongo db por que los id son objetos 
    // aqui no es necesario usar: propiedad.usuarioId.toString() 
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis_propiedades');
    }
    res.render('propiedades/agregar_imagen', {
        pagina: `Agregar Imagen: ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        propiedad
    });
}
const almacenarImagen = async (req, res, next) => {
    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id);
    if(!propiedad){
        return res.redirect('/mis_propiedades');
    }
    if(propiedad.publicado){
        return res.redirect('/mis_propiedades');
    }
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis_propiedades');
    }
    try {
        // almacenar la imagen y publicar propiead
        console.log(req.file.filename);
        propiedad.imagen = req.file.filename;
        propiedad.publicado = 1;
        await propiedad.save();
        next()
    } catch (error) {
        console.log(error);
    }
}

const editar = async (req, res) => {
    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id);
    if(!propiedad){
        return res.redirect('/mis_propiedades');
    }
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis_propiedades');
    }
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ]);
    res.render('propiedades/editar',{
        pagina: `Editar Propiedad: ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: propiedad
    });
}

const guardarCambios = async (req, res) => {
    // Validacion
    let resultado = validationResult(req);
    if(!resultado.isEmpty()){
        // Consultamos precios y categorias
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ]);
        return  res.render('propiedades/editar',{
            pagina: 'Editar Propiedad', 
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        });
    }
    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id);
    if(!propiedad){
        return res.redirect('/mis_propiedades');
    }
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis_propiedades');
    }
    try {
        const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId , categoria: categoriaId  } = req.body;
        propiedad.set({
            titulo, 
            descripcion, 
            habitaciones, 
            estacionamiento, 
            wc, 
            calle, 
            lat, 
            lng, 
            precioId, 
            categoriaId
        });
        await propiedad.save();
        res.redirect('/mis_propiedades');
    } catch (error) {
        console.log(error);
    }
}
const eliminar = async (req, res) => {
    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id);
    if(!propiedad){
        return res.redirect('/mis_propiedades');
    }
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis_propiedades');
    }
    await propiedad.destroy();
    // eliminar imagen
    await unlink(`public/uploads/${propiedad.imagen}`);
    res.redirect('/mis_propiedades');
}
// para el publico mostrar propiedad
const mostrarPropiedad = async (req, res) => {
    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id,{
        include: [
            { model: Categoria, as: 'categoria' },
            { model: Precio, as: 'precio' }
        ]
    });
    
    if(!propiedad){
        return res.redirect('/404');
    }
    return  res.render('propiedades/mostrar',{
        propiedad,
        pagina: propiedad.titulo
    });
}
export {
    admin, 
    crear,
    guardar,
    agregarImagen,
    almacenarImagen,
    editar, 
    guardarCambios,
    eliminar,
    mostrarPropiedad
}