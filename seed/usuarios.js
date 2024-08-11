import bcrypt from 'bcrypt';
const usuarios = [

    {
        nombre: 'David',
        email: 'david@gmail.com',
        confirmado: 1,
        password: bcrypt.hashSync('password', 1)
    }
];

export default usuarios;