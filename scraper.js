/**
 * Scrapes Testudo and builds a database of all the classes
 */

var rp = require('request-promise');
var cheerio = require('cheerio');

var database = require('./database.js');

var baseUrl = 'https://ntst.umd.edu/soc/';

// TODO: Add other semesters, logic to de-dupe
var semesters = ['201708'];
var depts = [];

function processDepartment(dept) {
    return new Promise(function(resolve, reject) {
        var data = [];
        var url = baseUrl + semesters[0] + '/' + dept;

        rp(url).then(function(body) {
            var $ = cheerio.load(body);

            $('.course').each(function(element, index) {
                var course = {};

                course.id = $(this).attr('id');
                course.title = $('.course-title', this).text();
                course.dept = dept;

                course.credits = $('.course-min-credits', this).text();
                course.semester = semesters[0];

                //TODO: Relationship parsing
                course.description = $('.approved-course-text', this).text();
                if(course.description == '') {
                    course.description = $('.course-text', this).text();
                }

                var grading = $('.grading-method abbr', this).attr('title');
                course.grading_method = grading ? grading.split(', ') : [];

                var core = [];
                $('.core-codes-group a', this).each(function(element, index) {
                    core.push($(this).text());
                });
                course.core = core;

                var gen_eds = [];
                $('.course-subcategory a', this).each(function(element, index) {
                    gen_eds.push($(this).text());
                });
                course.gen_ed = gen_eds;

                data.push(course);
            });
        }).then(function() {
            var db_calls = [];
            for(var i = 0; i < data.length; i++) {
                db_calls.push(new Promise(function(fufill, reject) {
                    database.addClass(data[i], function() {
                        fufill();
                    });
                }));
            }
            Promise.all(db_calls).then(function() {
                resolve();
            });
        });
    });
}

/* Get all the departments */
console.time("Took");
rp(baseUrl).then(function(body) {
    var $ = cheerio.load(body);

    $('.prefix-abbrev').each(function(index, element) {
        depts.push($(this).text());
    });

}).then(function() {
    var promises = [];
   for(var i = 0; i < depts.length; i++) {
       promises.push(processDepartment(depts[i]));
   }
   Promise.all(promises).then(function() {
    console.log("Done!");
    console.timeEnd("Took");
    process.exit();
   })
});