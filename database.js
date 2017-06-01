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

function findClass(id, callback) {
    var query = client.query("SELECT * FROM classes where where id=$1;", [id]);
    query.on("row", function (row, result) {
        result.addRow(row);
    }).on("end", function(result) {
        if(result.length == 0 || result["rows"][0] == null) {
            err();
            return;
        }
        callback(result ["rows"][0]);
    });
}

module.exports = {
    'addClass': addClass,
    'findClass': findClass
}