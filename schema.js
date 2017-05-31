var ql = require('graphql');

var schema = ql.buildSchema(`
    type Class {
        id: String
        name: String
        dept: String
    }

    type Department {
        id: String
        name: String
    }

    type Query {
        class(id: String): Class
    }

`);

var testData = {
    "cmsc216": {
        id: "cmsc216",
        name: "C",
        dept: "CMSC"
    },
    "cmsc250": {
        id: "cmsc250",
        name: "discrete",
        dept: "CMSC"
    },
    "math240": {
        id: "math240",
        name: "lin alg",
        dept: "MATH"
    }
}

var root = {
    class: function({id}) {
        console.log("dsgsdg");
        return testData[id];
    }
}

module.exports = {
    schema: schema,
    root: root
}