import { Dropzone } from 'dropzone';

const token = document.querySelector('meta[name="csrf_token"]').getAttribute('content');
// console.log(token);

Dropzone.options.imagen = {
    dictDefaultMessage: 'Sube tus imagenes aqui',
    acceptedFiles: '.png, .jpg, .jpeg',
    maxFilesize: 5,
    maxFiles: 1,
    paralleUploads: 1,
    // esta opcion en true sube la imagen automaticamente 
    // con false espera que precione el boton para guardar la imagen
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: 'Borrar Archivo',
    dictMaxFilesExceeded: 'El limite es 1 archivo',
    headers: {
        'CSRF-Token': token
    },
    // este es el nombre donde se va a subir el middleware
    paramName: 'imagen',
    // configuracion para subir imagen no en automaico y pasar el 
    // nombre del archivo
    init: function() {
        const dropzone = this;
        const btnPublicar = document.querySelector('#publicar');

        btnPublicar.addEventListener('click', function(){
            dropzone.processQueue()
        });
        // finalizar el proceso de dropzone y 
        // redireccionar
        dropzone.on('queuecomplete', function(){
            if(dropzone.getActiveFiles().length == 0){
                window.location.href = '/mis_propiedades';
            }
        });
    }
}