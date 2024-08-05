import express from 'express';
import { body } from 'express-validator';
import { admin, crear, guardar } from '../controllers/propiedadController.js'
const router = express.Router();

router.get('/mis_propiedades', admin);
router.get('/propiedades/crear', crear);
router.post('/propiedades/crear', 
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

export default router;