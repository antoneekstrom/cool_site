var app = require('../../../server').app;
var path = require('path');
var fs = require('fs');

module.exports = {

    /**
     * Setup server response for /user paths
     */
    handleUserPaths() {
        app.get('/user/profile', (req, res) => {

            const username = req.query.username;

            this.getProfile(username, (profile) => {
                res.send(profile);
            });
        });
    },

    login(username, password) {},

    /**
     * 
     * @param {String} name 
     * @param {function(Object):void} callback 
     */
    getProfile(name, callback) {
        const file = name + '.json';
        const filepath = path.resolve(__dirname + '/../data/profiles/' + file);

        fs.readFile(filepath, (err, data) => {
            var obj = JSON.parse(data);
            callback(obj);
        });
    }
};