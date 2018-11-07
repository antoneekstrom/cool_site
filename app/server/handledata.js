var server = require('../../server');
var app = server.app;
var path = require('path');
var fs = require('fs');
var crypto = require('crypto');
var db = require('../server/db/database');

const SALT_LENGTH = 8;

/**
 * 
 * @param {String} username name of the user
 * @param {function(Object, Object):void} callback 
 */
function selectUserFromDb(username, callback) {
    let con = server.db.getConnection();
<<<<<<< HEAD
    con.query('SELECT * FROM web.users WHERE id = ' + 1 + ';', (err, results, fields) => {
        if (err) console.log(err);
=======
    con.query('SELECT * FROM web.users WHERE username = ?;', [username], (err, results, fields) => {
>>>>>>> 33022f19509badaa05b57f0a4442bc1a67cd2b6e
        callback(results, fields);
    });
}

/**
 * Retrieve userdata from MySql server as a JSON object in a callback.
 * @param {String} name username
 * @param {function(JSON):void} callback 
 */
function getProfileFromDatabase(name, callback) {
    selectUserFromDb(name, (data) => {
        if (data == null) {data = {};}
        if (data.length > 0) {
            var json = JSON.stringify(data[0]);
            callback(json);
        }
    });
}

module.exports = {

    sqlResultsIntoObject(results) {
        let obj = {};
        for (let i = 0; i < results.length; i++) {
        }
        return obj;
    },

    /**
     * Setup server response for /user paths
     */
    handleUserPaths() {
        app.get('/user/profile', (req, res) => {

            const username = req.query.username;

            this.getProfile(username, (json) => {
                res.send(json);
            });
        });
    },

    /**
     * I did not write this function.
     * @param {int} len 
     */
    randomHexValue(len) {
        var maxlen = 8,
        min = Math.pow(16,Math.min(len,maxlen)-1) 
        max = Math.pow(16,Math.min(len,maxlen)) - 1,
        n   = Math.floor( Math.random() * (max-min+1) ) + min,
        r   = n.toString(16);
        while ( r.length < len ) {
            r = r + randHex( len - maxlen );
        }
        return r;
    },

    encryptString(s) {
        let hash = crypto.createHash('md5');
        hash.update(s);
        return hash.digest('hex');
    },

    /**
     * @param {Request} req 
     */
    processUserCreate(req) {
        let passobj = this.encryptPassword(req);
        let pass = passobj.pass;
        let salt = passobj.salt;
        let con = db.getConnection();
        con.query('INSERT INTO web.users (username, password, firstName, lastName, salt) VALUES (?, ?, ?, ?, ?)',
        [
            req.body.username,
            pass,
            req.body.firstname,
            req.body.lastname,
            salt
        ]);
    },

    /**
     * @param {Request} req 
     */
    encryptPassword(req) {
        let salt = this.randomHexValue(SALT_LENGTH);
        let encryptedPass = this.encryptString(req.body.password + salt);
        return {pass: encryptedPass, salt: salt};
    },

    handlePost() {
        app.post('/user/create', (req, res) => {
            this.processUserCreate(req);
        });
    },

    login(username, password) {},

    /**
     * @param {String} name 
     * @param {function(Object):void} callback 
     */
    getProfile(name, callback) {
        getProfileFromDatabase(name, (json) => callback(json));
    }
};