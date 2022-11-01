const multer = require('multer');
const path = require('path');
require('dotenv').config();
const config = require('config');

//mimetype types of files the api will accept
const MIME_TYPES = {
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/pdf': 'pdf'
};
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        let pathFolder = path.resolve(__dirname, config.get('path_folder'));
        console.log(pathFolder);
        callback(null, pathFolder);
    },
    filename: (req, file, callback) => {
        console.log('im here');
        const extension = MIME_TYPES[file.mimetype]
        let datePart = new Date(Date.now());
        datePart = datePart.toLocaleDateString().split('/').join('_');
        
        callback(null, 'CV_' + datePart.toString() + '.' + extension);
    }
});

module.exports = multer({storage: storage}).fields([
    { name: 'cv', maxCount: 1 },
    { name: 'application', maxCount: 1 }
]);