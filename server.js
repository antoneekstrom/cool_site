const path = require('path');
const fs = require('fs');

const express = require('express');
const app = express();
module.exports.app = app;
module.exports.__rootdir = __dirname;

const ud = require('./app/server/usedirectory');
const login = require('./app/server/session/login');

const port = 8080, hostname = 'localhost';

app.use('/', express.static(__dirname + '/app/dist'));

login.handleUserPaths(app);

function run() {
    getText()
    .then(() => getImages()
    .then(() => doCatchAll()
    ));
}

/** text / code examples */
function getText() {
    return ud.getDirectory('/data/text', path.resolve(__dirname + '/app/server/data/text'));
}
/** images */
function getImages() {
    return ud.getDirectory('/data/images', path.resolve(__dirname + '/app/server/data/images'));
}

/** Catch all with index.html */
function doCatchAll() {
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname + '/index.html'));
    });
}

//execute functions and start server
run();

app.listen(port, hostname, () => console.log(`listening on ${hostname}:${port}`));