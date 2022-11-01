const error = require('../middleware/error');

module.exports = (app, debug) => {
  
    app.get('/', (req, res) => {
        res.send('welcome');
    });
    require('../routes/hiring')(app);
    app.use(error);
}