const fs = require('fs');
const path = require('path');
var app = require('../../server').app;

module.exports = {

    /**
     * @param {String} path 
     * @param {Response} res
     */
    sendFile(res, path) {
        res.sendFile(path);
    },

    /**
     * @param {String[]} files 
     */
    useFiles(route, files) {
        files.forEach((file, index) => {
            const fileroute = route + '/' + file.split('\\').pop();
            console.log(fileroute);
            app.get(fileroute, (req, res) => this.sendFile(res, file));
        });
    },

    /**
     * @param {String} route
     * @param {String} dir 
     */
    getDirectory(route, dir) {
        let module = this;
        /** do the method, nice */
        function run(callback) {
            fs.readdir(dir, (err, files) => {
                files.forEach((f, i) => {
                    files[i] = path.resolve(dir + '/' + f);
                });
                module.useFiles(route, files);
                callback();
            });
        }

        /** ACTUALLY do the method, epic */
        return new Promise(function(resolve, reject) {
            /**
             * REALLY ACTUALLY execute the method, heck yeah.
             * And also fulfill promise and say things went nice y'know.. when it's done that is.
             */
            run(() => resolve());
        });
    }
}