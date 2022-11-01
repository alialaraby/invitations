const cors = require('cors');

module.exports = (app) => {
    app.use(cors())
    app.options('*' , cors());
    app.use((req, res, next)=> {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', true);
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        next();
    })
}