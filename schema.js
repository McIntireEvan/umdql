var ql = require('graphql');
var database = require('./database.js');

var schema = ql.buildSchema(`
    # Stores the data for a single class
    type Course {
        # The ID of the class
        course_id: String

        # The full name of the class
        name: String

        # The department code of the class
        dept_id: String

        # The number of credits the class is
        credits: Int

        # The codes for the general education requirements the class fufills
        gen_ed: [String]

        # The course description
        description: String
    }

    type Query {
        # Searches for an individual course by its ID
        course(course_id: String): Course

        # Searches all courses based on one or more of these criteria
        courses(dept_id: String, credits: Int, gen_ed: [String]): [Course]
    }

`);

/**
 * Contains the handlers for the schema
 */
var root = {
    course: function({course_id}) {
        return new Promise(function(resolve, reject) {
            database.findClass(course_id, function(rows) {
                resolve(rows[0]);
            });
        });
    },
    courses: function({dept_id, credits, gen_ed}) {
        return new Promise(function(resolve, reject) {
            var depts = dept_id ? dept_id.split(',') : undefined;

            var gen_eds = [];
            var len = gen_ed ? gen_ed.length : 0;

            for(var i = 0; i < len; i++) {
                gen_eds.push(row = gen_ed[i].split(','));
            }
            database.findClasses({depts, credits, gen_eds}, function(rows) {
                resolve(rows);
            }, function() {
                resolve([]);
            });
        });
    }
}

module.exports = {
    schema: schema,
    root: root
}