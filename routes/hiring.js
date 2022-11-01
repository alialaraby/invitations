const bodyParser = require('body-parser')
const { check, validationResult } = require('express-validator');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const sheetUpdater = require('../middleware/sheets-updater');
const uploader = require('../middleware/uploader')
const validationRules = [
    check('position', 'Choose a Position').not().isEmpty().trim(),
    check('expyears', 'Years of Experience is not valid').not().isEmpty().trim().escape(),
    check('uniquereason', 'Unique Reason is Required').not().isEmpty().trim().escape(),
    check('choosereason', 'Choosing Reason is Required').not().isEmpty().trim().escape(),
    check('careerbrief', 'Career Brief is Required').not().isEmpty().trim().escape(),
];

module.exports = function(app){

    app.get('/hiringform', (req, res) => {
        res.render('hiring-form');
    });
    
    app.post('/hiringform', urlencodedParser, validationRules, async (req, res, next) => {
        const errors = validationResult(req)
        const reqBody = req.body;
        if(!errors.isEmpty()) {
            const alert = errors.array();
            res.render('hiring-form', { alert: alert, reqBody: reqBody });
        }else{
            try {
                if(!req.files.cv){
                    res.render('hiring-form', { alert: errors.array(), reqBody: reqBody });
                }else{

                    let uploadedFilePath = await uploader(req.files.cv);
                    let publicUrl = await sheetUpdater.uploadToDrive(req.files.cv, uploadedFilePath);

                    await sheetUpdater.addSheetRow(reqBody, publicUrl);
                    res.render('form-uploaded');
                }
            } catch (error) { next(error) }
        }
    });

}