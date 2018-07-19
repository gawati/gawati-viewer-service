const express = require('express');
const path = require('path');
const routes = require('./apiroutes');
const appconstants = require('./constants');

const app = express();

console.log(" Deploying Services... ");

app.use('/gwv', routes);

// app.use(
//     '/gwv/recent-docs', 
//     express.static(
//         path.join(
//             appconstants.FOLDER_CACHE, 
//             appconstants.FILE_RECENT_CACHE
//         )
//     )
// );

console.log(" Services Started... ");

app.use( function (err, req, res, next) {
    console.log (" ERROR LOGGED");
    res.status(500);
    res.render('error', { error: err });
});

module.exports = app;
