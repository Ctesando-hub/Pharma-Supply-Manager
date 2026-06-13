// Multer es el interprete de archivos de Express. Recibe los archivos enviados desde un form HTML

import multer from "multer"; //sin Multer Express no entiende de archivos

const storage = multer.memoryStorage({}); //Definir el storage. Muter crea carpetas temporales.

const upload = multer({storage}); //le pasamos la configuracion storage y obtenemos el middleware

export default upload;

//Frontend manda multipart/form-data
// Express recibe la request
// Multer se ejecuta antes del controller
// Multer:

//lee la imagen

//la guarda temporalmente

//llena req.file
// Controller:

//usa req.file.path

//sube a Cloudinary

//guarda la URL