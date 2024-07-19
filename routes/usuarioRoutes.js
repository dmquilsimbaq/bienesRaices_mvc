import express from 'express';
import { formularioLogin, formularioRegistro, registrar, confirmar, formularioOlvidePassword } from '../controllers/usuarioController.js';
const router = express.Router();

router.get('/login', formularioLogin);
router.get('/registro', formularioRegistro);
router.post('/registro', registrar);
router.get('/olvide_password', formularioOlvidePassword);
router.get('/confirmar/:token', confirmar);

export default router;