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
        # Searches for an individual course by its' ID
        course(course_id: String): Course

        # Searches all courses based on one or more of these criteria
        courses(dept_id: String, credits: Int): [Course]
    }

`);

/**
 * Contains the handlers for the schema
 */
var root = {
    couse: function({course_id}) {
        return new Promise(function(resolve, reject) {
            database.findClass(course_id, function(rows) {
                resolve(rows[0]);
            });
        });
    },

    courses: function({dept_id, credits}) {
        return new Promise(function(resolve, reject) {
            var depts = dept_id.split(',');
            database.findClasses({depts, credits}, function(rows) {
                resolve(rows);
            });
        });
    }
}

module.exports = {
    schema: schema,
    root: root
}