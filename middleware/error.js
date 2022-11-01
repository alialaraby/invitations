const debug = require('debug')('app:server_errors');
module.exports = (error, req, res, next) => {
    debug(error.message);
    res.status(500).json({error: error.message, message: 'something went wrong'});
}