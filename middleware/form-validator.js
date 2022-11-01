const { check, validationResult } = require('express-validator');

module.exports = (req, response) => {
    return [
        check('position', 'Choose a Position').exists(),
        check('expyears', 'Years of Experience is not valid').exists().isLength({ min: 2 })
    ]
}