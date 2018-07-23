const express = require('express');
const path = require('path');
const routes = require('./apiroutes');
const appconstants = require('./constants');

const app = express();

console.log(" Deploying Services... ");

app.use('/gwv', routes);

app.use(
    "/gwv/gawati.json",
    express.static(
        path.join(
            appconstants.CONFIG_FOLDER,
            appconstants.GAWATI_JSON
        )
    )
);

console.log(" Services Started... ");

app.use( function (err, req, res, next) {
    console.log (" ERROR LOGGED", err);
    res.status(500);
    res.send(err);
});

module.exports = app;
