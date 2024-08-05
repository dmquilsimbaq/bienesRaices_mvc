import jwt from 'jsonwebtoken'
//  Generar jwt para el usuario
// const generarJWT = id => jwt.sign( { id }, process.env.JWT_SECRET, { expiresIn: '1h' } );
const generarJWT = datos => jwt.sign( { id: datos.id, nombre: datos.nombre }, process.env.JWT_SECRET, { expiresIn: '1h' } );
// generar id unicos para el token
const generaId = () => Math.random().toString(32).substring(2) + Date.now().toString(32);

export {
    generarJWT,
    generaId
}