import jwt from 'jsonwebtoken';
import { Usuario } from '../models/index.js';

const protegerRuta = async (req, res, next) => {
    // console.log('Desde el middleware');
    // verificar si hay token
    const { _token } = req.cookies;
    if(!_token){
        return res.redirect('/auth/login');
    }
    // comprobar token
    try {
        
        const decoded = jwt.verify(_token, process.env.JWT_SECRET);
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id);
        //almacenar usuario al Req
        if(usuario){
            req.usuario = usuario;
        }else{
            return res.redirect('/auth/login');
        }
        // para ir al siguiente ruta y no este en un mismo ciclo
        next();
    } catch (error) {
        return res.redirect('/auth/login');
    }
 
}

export default protegerRuta;