var server = require('../../server');
var app = server.app;
var path = require('path');
var fs = require('fs');
var crypto = require('crypto');
var db = require('../server/db/database');

const SALT_LENGTH = 8, LOGIN_TOKEN_LENGTH = 32, TOKEN_LIFETIME = 120;

/**
 * 
 * @param {String} username name of the user
 * @param {function(Object, Object):void} callback 
 */
function selectUsersFromDb(username, callback) {
    let con = server.db.getConnection();
    con.query('SELECT * FROM web.users WHERE username = ?;', [username], (err, results, fields) => {
        callback(results, fields);
    });
}

/**
 * Retrieve userdata from MySql server as a JSON object in a callback.
 * @param {String} name username
 * @param {function(JSON):void} callback 
 */
function getUserAsJSON(name, callback) {
    selectUsersFromDb(name, (results, fields) => {
        if (results == null) {results = {};}
        if (results.length > 0) {
            var json = JSON.stringify(results[0]);
            callback(json);
        }
    });
}

let tokens = [];

module.exports = {

    sqlResultsIntoObject(results) {
        let obj = {};
        for (let i = 0; i < results.length; i++) {
        }
        return obj;
    },

    nullCheckQuery(q) {
        return q != null && q != '' && q != 'undefined';
    },

    handleDataPaths() {
        app.get('/data/users', (req, res) => {
            const q = req.query.username;
            selectUsersFromDb(q, (results, fields) => {
                res.send(results);
            });
        });
    },

    /**
     * Setup server response for /user paths
     */
    handleUserPaths() {
        /**
         * Request profile data for username
         */
        app.get('/user/profile', (req, res) => {

            const username = req.query.username;
            const tokenid = req.query.login_id;

            if (this.nullCheckQuery(username)) {
                
                this.getProfile(username, (profile) => {
                    res.send(profile);
                });
            }
            else if (this.nullCheckQuery(tokenid)) {

                this.getProfileWithTokenId(tokenid)
                .then((json) => {
                    res.send(json == null ? {} : json);
                });
            }
        });

        /**
         * Request logintoken for account
         */
        app.get('/user/login', (req, res) => {
            const username = req.query.username;
            const password = req.query.password;

            this.requestLoginToken(username, password)
            .then((token) => {
                res.send(JSON.stringify(token));
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
            r = r + this.randomHexValue( len - maxlen );
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
            res.send('nice');
        });
    },

    createLogintoken(username, lengthvalidinminutes) {
        let tokenid = this.randomHexValue(LOGIN_TOKEN_LENGTH);

        let date = new Date();
        date.setMinutes(date.getMinutes() + lengthvalidinminutes);
        
        let token = {
            username: username,
            id: tokenid,
            expires: date
        };
        tokens.push(token);
        return token;
    },

    getUsernameFromToken(tokenid) {
        let username;

        for (let i = 0; i < tokens.length; i++) {

            let t = tokens[i];
            if (tokenid == t.id) {
                username = t.username;
            }
        }

        return username;
    },

    getProfileWithTokenId(tokenid) {
        return new Promise((resolve, reject) => {

            if (this.authenticateWithtoken(tokenid)) {

                let username = this.getUsernameFromToken(tokenid);

                this.getProfile(username, (json) => {
                    resolve(json);
                });
            }
        });
    },

    /**
     * Returns TRUE if token is VALID and has NOT expired.
     * @param {boolean} tokenobj if token has expired
     */
    tokenHasNotExpired(tokenobj) {
        let d = new Date();
        let now = d.getTime();
        let then = tokenobj.expires.getTime();

        let hasExpired = then < now;

        return !hasExpired;
    },

    authenticateWithtoken(tokenid) {
        for (let i = 0; i < tokens.length; i++) {
            let token = tokens[i];
            
            if (token == null) {continue;}
            
            if (token.id == tokenid && this.tokenHasNotExpired(token)) {
                return true;
            }
        }
        return false;
    },

    requestLoginToken(username, password) {
        return new Promise((resolve, reject) => {

            this.authenticatePassword(username, password)
            .then((passIsValid) => {
    
                if (passIsValid) {
                    let token = this.createLogintoken(username, TOKEN_LIFETIME);
        
                    if (token != null) {
                        token.valid = true;
                        resolve(token);
                    }
                }
                else {
                    let emptyToken = {
                        valid: false
                    };
                    resolve(emptyToken);
                }
            });
        });
    },

    /**
     * @returns {Promise} promise with a boolean
     * @param {String} username 
     * @param {String} password 
     */
    authenticatePassword(username, password) {
        let run = (callback) => getUserAsJSON(username, (json) => {

            let user = JSON.parse(json);
            let passwordToTest = this.encryptString(password + user.salt);

            let valid = passwordToTest == user.password;
            callback(valid);
        });

        return new Promise((resolve, reject) => {

            if (username == '' || password == '') {
                resolve(false);
            }
            else {
                run((passwordIsCorrect) => resolve(passwordIsCorrect));
            }
        });
    },

    /**
     * @param {String} name 
     * @param {function(Object):void} callback 
     */
    getProfile(name, callback) {
        getUserAsJSON(name, (json) => callback(json));
    }
};