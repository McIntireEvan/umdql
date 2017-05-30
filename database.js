var pg = require('pg');
var fs = require('fs');

var config = JSON.parse(fs.readFileSync('./config.json', 'UTF-8'));
var dbConfig = config.database;

var connection = 'pg://' + dbConfig.user + ":" + dbConfig.password + "@" + dbConfig.server + ":" + dbConfig.port + "/" + dbConfig.database;

var client = new pg.Client(connection);
client.connect();


var sql = fs.readFileSync('init.sql').toString();
client.query(sql);

/**
 * Writes a calss to the database
 * @param {Object} json
 */
function addClass(json) {
    client.query(
        "INSERT INTO classes(course_id, course_name, dept, credits, gen_eds, description) values ($1, $2, $3, $4, $5, $6);",
        [json.id, json.title, json.dept, json.credits, json.gen_ed, json.description]);
}

module.exports = {
    'addClass': addClass
}