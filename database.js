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
function addClass(json, callback) {
    client.query(
        `INSERT INTO classes(course_id, name, dept_id, semester, credits, grading_method, core, gen_ed, description)
                        values ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
        [json.id, json.title, json.dept, json.semester, json.credits, json.grading_method, json.core, json.gen_ed, json.description], callback);
}

function findClass(id, callback) {
    console.log(id);
    var query = client.query("SELECT * FROM classes WHERE classes.course_id=$1;", [id]);
    query.on("row", function (row, result) {
        result.addRow(row);
    }).on("end", function(result) {
        if(result.length == 0 || result["rows"][0] == null) {
            return;
        }
        callback(result["rows"]);
    });
}

function findClasses({depts, credits, gen_eds}, callback, err) {
    var query = client.query(`
        SELECT * FROM classes WHERE (classes.dept_id = ANY($1) OR $1 IS NULL)
                                AND (classes.credits = $2 OR $2 IS NULL);`,
                                [depts, credits]);
    query.on("row", function (row, result) {
        for(var i = 0; i < gen_eds.length; i++) {
            var found = false;

            for(var j = 0; j < row.gen_ed.length; j++) {
                if(gen_eds[i].indexOf(row.gen_ed[j]) != -1) {
                    found = true;
                }
            }

            if(!found) {
                return;
            }
        }
        console.log(row.course_id)
        result.addRow(row);
    }).on("end", function(result) {
        if(result.length == 0 || result["rows"][0] == null) {
            err();
            return;
        }
        callback(result["rows"]);
    });
}

module.exports = {
    'addClass': addClass,
    'findClass': findClass,
    'findClasses': findClasses
}