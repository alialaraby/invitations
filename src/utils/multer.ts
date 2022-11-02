import multer from 'multer';

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png',
    'application/octet-stream': 'jpeg'
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb(null, './uploads/') // local
        cb(null, '/var/www/testing/html/') // prod
    },

    filename: function (req: any, file: any, cb: any) {
        let name = '';
        const extension = MIME_TYPES[file.mimetype];
        
        // if(file.fieldname.includes('tourImage')){
        //     name = req.body.code.replace(/\s/g, '');
        // }else 
        if(file.fieldname.includes('passengerImage')){
            name = req.body.email.replace(/\s/g, '');
        }else if(file.fieldname.includes('studentCetificate')){
            name = 'cetificate_' + req.body.email.replace(/\s/g, '');
        }else{
            name = file.originalname.replace(/\s/g, '');
        }

        cb(null, `${name}.${extension}`)
    }
});

const fileFilter = (req: any, file: any, cb: any) => {
    if (
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png"
    ) {
        cb(null, true);
    } else {
        cb(new Error("Image uploaded is not of type jpg/jpeg or png"), false);
    }
}

function exctractNameNoExtension(originalName) {
    try {
        let namePartsSplitted = originalName.split('.');
        namePartsSplitted.pop();
        return namePartsSplitted.join('');
    } catch (e) {
        console.log(e);
        return originalName;
    }
}

export const upload = multer({ storage: storage, fileFilter: fileFilter });

// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         let formPath = '';
//         formPath = process.env.PATHFODLER;

//         callback(null, './uploads/');
//     },
//     filename: (req, file, callback) => {
//         callback(null, file.originalname);
//     }
// });
// export const m = multer({storage: storage}).fields([
//     { name: 'imageUrl' },
// ]);