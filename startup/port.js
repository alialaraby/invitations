module.exports = (app, debug) => {
    //app listening, home request and establish db connection
    debug('listening on port ...');
    app.listen(process.env.PORT || 3000, () => {
        debug(`listening on port: ${process.env.PORT || 3000}`);
    });
}