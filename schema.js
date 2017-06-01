var ql = require('graphql');
var database = require('./database.js');

var schema = ql.buildSchema(`
    # Stores the data for a single class
    type Course {
        # The ID of the class
        id: String

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
        course(id: String): Course

        # Searches all courses based on one or more of these criteria
        courses(dept_id: String, gen_ed: [String], credits: Int): [Course]
    }

`);

var testData = {
    "cmsc216": {
        id: "cmsc216",
        name: "C",
        dept_id: "CMSC"
    },
    "cmsc250": {
        id: "cmsc250",
        name: "discrete",
        dept_id: "CMSC"
    },
    "math240": {
        id: "math240",
        name: "lin alg",
        dept_id: "MATH"
    }
}

var root = {
    couse: function({id}) {
        console.log("dsgsdg");
        return testData[id];
    },

    courses: function({dept, gen_ed}) {
        if(gen_ed) {
            console.log(gen_ed);
        } else {
            console.log("undef");
        }

        var vals = [];

        for(var key in testData) {
            if(testData.hasOwnProperty(key)) {
                if(testData[key].dept_id == dept) {
                    console.log("Pushing...");
                    vals.push(testData[key]);
                }
            }
        }

        return vals;
    }
}

module.exports = {
    schema: schema,
    root: root
}