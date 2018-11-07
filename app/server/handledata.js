var server = require('../../server');
var app = server.app;
var path = require('path');
var fs = require('fs');

/**
 * The old way where I stored one user in .json format in /app/server/data/profiles/. First time I get to say deprecated?
 * @param {String} name username
 * @param {function(JSON):void} callback when the deed is done
 */
function getProfileFromJSON(name, callback) {
    const file = name + '.json';
    const filepath = path.resolve(__dirname + '/../data/profiles/' + file);

    fs.readFile(filepath, (err, data) => {
        var obj = JSON.parse(data);
        callback(obj);
    });
}

function selectUserFromDb(username, callback) {
    let con = server.db.getConnection();
    con.query('SELECT * FROM web.users WHERE id = ' + 1 + ';', (err, results, fields) => {
        if (err) console.log(err);
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

    login(username, password) {},

    /**
     * @param {String} name 
     * @param {function(Object):void} callback 
     */
    getProfile(name, callback) {
        getProfileFromDatabase(name, (json) => callback(json));
    }
};