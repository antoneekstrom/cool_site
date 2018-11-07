const path = require('path');
const fs = require('fs');

const express = require('express');
const app = express();
module.exports.app = app;
module.exports.__rootdir = __dirname;

const ud = require('./app/server/usedirectory');
const login = require('./app/server/handledata');
const db = require('./app/server/db/database');

var bodyparser = require('body-parser');

module.exports.db = db;

const port = 8080, hostname = '10.189.212.116';

app.use('/', express.static(__dirname + '/app/dist'));
app.use(bodyparser.urlencoded({
    extended: true
}));

function runDb() {
    let run = (callback) => {
        db.sqlLogin('server', 'password');
        db.connect((err) => callback());
    }
    return new Promise((resolve, reject) => {
        run(() => resolve());
    });
}

function run() {
    login.handleUserPaths();
    login.handlePost();

    runDb()
    .then(() => getText()
    .then(() => getImages()
    .then(() => {
        doCatchAll();
        listen(hostname, port);
    }
    )));
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

function listen(hostname, port) {
    app.listen(port, hostname, () => console.log(`listening on ${hostname}:${port}`));
}

//execute functions and start server
run();