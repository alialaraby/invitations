const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');
const compression = require('compression');
const fileUpload = require('express-fileupload');

module.exports = (app, debug) => {
    debug('initializing app configs ...');
    app.use(express.json());
    app.use(express.static(module.parent.path + '/public'));
    app.use(helmet({ contentSecurityPolicy: false }));
    app.use(compression());
    if(app.get('env') === 'development'){
        app.use(morgan('short'));
    }
    app.use(fileUpload());
    app.set('view engine', 'ejs');
    app.set('views', './views');
}