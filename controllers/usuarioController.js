import { check, validationResult } from 'express-validator';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js';
import { generaId, generarJWT } from '../helpers/tokens.js'
import { emailRegistro, emailOlvidePassword } from '../helpers/emails.js'
import { json } from 'sequelize';

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión',
        csrfToken: req.csrfToken(),
    });
}
const autenticar = async (req, res) => {
    await check("email").isEmail().withMessage('El email es obligatorio').run(req);
    await check("password").notEmpty().withMessage('El password es obligatorio').run(req);
    let resultado = validationResult(req);
    if(!resultado.isEmpty()){
        res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        });
    }
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ where : {email}});
    if(!usuario){
        res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El Usuario no exise'}]
        });
    }
    if(!usuario.confirmado){
        res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'Tu cuenta no ha sido confirmada'}]
        });
    }
    if(!usuario.verificarPassword(password)){
        res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El password es incorrecto'}]
        });
    }
    const token = generarJWT({ id: usuario.id, nombre: usuario.nombre});
    // Almacenar cookie
    return res.cookie('_token', token,{
        httOnly: true,
        // tiempo de expiracion del token en milisegundos
        // expire: 9000
        // habiliatra para paginas https
        // secure: true
    }).redirect('/mis_propiedades');
}
const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()
    });  
}
const registrar = async(req, res) => {
    // VALIDACIONES
    await check("nombre").notEmpty().withMessage('El nombre no puede ir vacio').run(req);
    await check("email").isEmail().withMessage('El email esta incorrecto').run(req);
    await check("password").isLength({ min: 3}).withMessage('El password debe contener 3 caracteres minimos').run(req);
    let resultado = validationResult(req).array();
    if(req.body.password != req.body.repetir_password){
        resultado.push({msg: 'Los passwords no son iguales'});
    } 
    
    if(resultado.length > 0){
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: resultado, 
            csrfToken: req.csrfToken(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,
            }
        }); 
    }
    const { nombre, email, password } = req.body;
    let existeUsuario = await Usuario.findOne({ where: { email }});
    if(existeUsuario){
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: [{msg: 'El usuario ya esta registrado'}], 
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,
            }
        });
    }
   const usuario = await Usuario.create({
    nombre,
    email,
    password,
    token: generaId()
   });
    //    envio mensajes
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })
    //mostara mensaje de confirmacion
   res.render('templates/mensaje', {
    pagina: 'Cuenta Creada Correctamente',
    mensaje: 'Hemos enviado un Email de Confirmacion, preciona en el enlace'
   });
}
const confirmar = async(req, res, next) => {
    const { token } = req.params;
//    paraginalizar las paginas que no teines a dodne aputar y no se quede esperando el navegador tiene 
//    next();
    const usuario = await Usuario.findOne({ where: {token}})
    if(!usuario){
        return res.render('auth/confirmar_cuenta', {
            pagina:'Error al confirma tu cuenta',
            mensaje:'Hubo un error al identificar tu cuenta, intenta de nuevo',
            error: true
        });
    }
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();
    return res.render('auth/confirmar_cuenta', {
        pagina:'Cuenta Confirmada',
        mensaje:'La cuenta se confirmo corretamente',
    });
    
}
const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide_password', {
        pagina: 'Olvide Password',
        csrfToken: req.csrfToken()
    });
}
const resetPassword = async (req, res) => {
    await check("email").isEmail().withMessage('El email esta incorrecto').run(req);
    let resultado = validationResult(req);
    if(!resultado.isEmpty()){
        return res.render('auth/olvide_password', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            errores: resultado.array(), 
            csrfToken: req.csrfToken(),
        }); 
    }
    // Buscar usuario
    const { email }= req.body;
    const usuario = await Usuario.findOne({ where: { email }});
    if(!usuario){
        return res.render('auth/olvide_password', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            errores: [{msg: 'El email no pertenece a ningun usuario'}], 
            csrfToken: req.csrfToken(),
        }); 
    }
    // generar un token y enviar un email
    usuario.token = generaId();
    await usuario.save();
    // Enviar email
    emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    });
    //mostara mensaje de confirmacion
    res.render('templates/mensaje', {
        pagina: 'Reestablece tu password',
        mensaje: 'Hemos enviado un Email con las instrucciones'
    });
}
const comprobarToken = async (req, res) => {
    const { token } = req.params;
    const usuario = await Usuario.findOne({ where: {token}});
    if(!usuario){
        return res.render('auth/confirmar_cuenta', {
            pagina:'Reestablece tu Password',
            mensaje:'Hubo un erroral validar tu informacion, intenta de nuevo',
            error: true
        });
    }
    return res.render('auth/reset_password', {
        pagina:'Reestablece tu Password',
        csrfToken: req.csrfToken(),
    });
}
const nuevoPassword = async (req, res) => {
    await check("password").isLength({ min: 3}).withMessage('El password debe contener 3 caracteres minimos').run(req);
    let resultado = validationResult(req);
    if(!resultado.isEmpty()){
        return res.render('auth/reset_password', {
            pagina:'Reestablece tu Password',
            errores: resultado, 
            csrfToken: req.csrfToken(),
        }); 
    }
    const { token } = req.params;
    const { password } = req.body;

    const usuario = await Usuario.findOne({ where: {token}});
    
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);
    usuario.token = null;
    await usuario.save();
    return res.render('auth/confirmar_cuenta', {
        pagina:'Password Reestablecido',
        mensaje: 'El password se guardo correctamente'
    }); 
}
export {
    formularioLogin,
    autenticar,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword
}