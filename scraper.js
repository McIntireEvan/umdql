/**
 * Scrapes Testudo and builds a database of all the classes
 */

var request = require('request');
var cheerio = require('cheerio');

var baseUrl = "https://ntst.umd.edu/soc/";

request(baseUrl, function(error, response, body) {
    if(!error) {
        var $ = cheerio.load(body);

        $('.prefix-abbrev').each(function(index, element) {
            console.log($(this).text());
        });
    }
});