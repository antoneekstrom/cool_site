const sql = require('mysql');

const port = 3306, host = 'localhost';
var credentials = {}, hasCredentials = true;
var connection;

module.exports = {

    sqlLogin(username, password) {
        credentials.username = username;
        credentials.password = password;
        hasCredentials = true;
    },
    
    getLoginInformation() {
        if (hasCredentials) { return credentials; }
        else {
            console.log('MySQL login information is empty.');
        }
    },

    /**
     * @returns {sql.Connection} connection
     */
    getConnection() {
        return connection;
    },
    
    /**
     * @param {String} username 
     * @param {String} password 
     * @returns {Connection} connection
     */
    createConnection(username, password) {
        connection = sql.createConnection({
            host: host,
            port: port,
            user: username,
            password: password
        });
        return connection;
    },
    
    /**
     * @param {function(MysqlError):void} callback when connect has been established
     */
    connect(callback) {
        const login = this.getLoginInformation();
        console.log('sql username: ' + login.username + ' password: ' + login.password);
        const con = this.createConnection(login.username, login.password);
        
        con.connect((err) => {
            if (err) { console.log(err); }
            else {
                console.log(`${login.username}@${host}:${port} connected successfully.`);
            }
            callback(err);
        });
    },
}