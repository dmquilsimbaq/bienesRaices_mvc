import { check, validationResult } from 'express-validator';
// import  {}  from en
import Usuario from '../models/Usuario.js';
import { generaId } from '../helpers/tokens.js'
import { emailRegistro } from '../helpers/emails.js'

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión',
        
    });
}
const formularioRegistro = (req, res) => {
    console.log("en inicio del formulario");
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
    console.log('aqui en registrar');
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
        pagina: 'Olvide Password'
    });

}

export {
    formularioLogin,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword
}