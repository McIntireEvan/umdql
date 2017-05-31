var express = require('express');

var app = express();
//var db = require('./database.js');

var graphql = require('graphql').graphql;
var bodyParser = require('body-parser');

var schema = require('./schema.js');

app.use(bodyParser.text({ type: 'application/graphql' }));

app.post('/graphql', function(req, res) {
    graphql(schema.schema, req.body, schema.root).then(function (result) {
      console.log(result);
        res.send(JSON.stringify(result, null, 2));
    });
});

app.listen(8284, function() {
    console.log("Running!");
});
