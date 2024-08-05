import { validationResult } from 'express-validator';
// import Categoria from '../models/Categoria.js'
// import Precio from '../models/Precio.js'
import { Propiedad } from '../models/index.js';
const admin = (req, res) => {
    res.render('propiedades/admin', {
        pagina: 'Mis propiedades',
        barra: true
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
        barra: true,
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
        console.log(req.body);
        return  res.render('propiedades/crear',{
            pagina: 'Crear Propiedad', 
            csrfToken: req.csrfToken(),
            barra: true,
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        });
        const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precioId: precio, categoriId: categoria  } = req.body;
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
                categoriId
            });
        } catch (error) {
            console.log(error);
            
        }
    }
   
}
export {
    admin, 
    crear,
    guardar
}