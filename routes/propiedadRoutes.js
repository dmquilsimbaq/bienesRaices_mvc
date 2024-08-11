import express from 'express';
import { body } from 'express-validator';
import { admin, crear, guardar, agregarImagen, almacenarImagen, editar, guardarCambios, eliminar, mostrarPropiedad } from '../controllers/propiedadController.js';
import protegerRuta from '../middleware/protegerRuta.js';
import upload from '../middleware/subirImagen.js';

const router = express.Router();

router.get('/mis_propiedades', protegerRuta, admin);
router.get('/propiedades/crear', protegerRuta, crear);
router.post('/propiedades/crear', protegerRuta,
    body('titulo').notEmpty().withMessage('El Titulo del anuncio es obligatorio'),
    body('descripcion')
        .notEmpty().withMessage('La descriocion no puede ir vacia')
        .isLength({ max: 200}).withMessage('La descripcion es muy larga'),
    body('categoria').isNumeric().withMessage('Seleciona una categoria'),
    body('precio').isNumeric().withMessage('Seleciona un precio'),
    body('habitaciones').isNumeric().withMessage('Seleciona el numero de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Seleciona el numero de estacionamientos'),
    body('wc').isNumeric().withMessage('Seleciona el numero de baños'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),
    guardar
);
router.get('/propiedades/agregar_imagen/:id', protegerRuta, agregarImagen);
// para subir varias imagenes => upload.array
router.post('/propiedades/agregar_imagen/:id', protegerRuta, upload.single('imagen'), almacenarImagen);
router.get('/propiedades/editar/:id', protegerRuta, editar );
router.post('/propiedades/editar/:id', protegerRuta,
    body('titulo').notEmpty().withMessage('El Titulo del anuncio es obligatorio'),
    body('descripcion')
        .notEmpty().withMessage('La descriocion no puede ir vacia')
        .isLength({ max: 200}).withMessage('La descripcion es muy larga'),
    body('categoria').isNumeric().withMessage('Seleciona una categoria'),
    body('precio').isNumeric().withMessage('Seleciona un precio'),
    body('habitaciones').isNumeric().withMessage('Seleciona el numero de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Seleciona el numero de estacionamientos'),
    body('wc').isNumeric().withMessage('Seleciona el numero de baños'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),
    guardarCambios
);
router.post('/propiedades/eliminar/:id', protegerRuta, eliminar);

// arear publica
router.get('/propiedad/:id', mostrarPropiedad);
export default router;