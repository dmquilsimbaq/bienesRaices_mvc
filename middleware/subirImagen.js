import multer from 'multer';
import path from 'path';
import { generaId } from '../helpers/tokens.js';

const storage = multer.diskStorage({
    // esta configuracion nos permite guardar los archivos
    // 
    destination: function (req, file, cb){
        cb(null, './public/uploads/')
    },
    filename: function(req, file, cb){
        cb(null, generaId() + path.extname(file.originalname))
    }
});

const upload = multer({ storage });

export default upload;