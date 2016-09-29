'use strict';
var yeoman = require('yeoman-generator');

module.exports = {
    /** Parses a comma-separated list and iterates through all elements, calling callback for each of them */
    iterateCommaList: function (list, callback) {
        var names = list.split(',');

        for (var name of names) {
            name = name.trim();
            callback(name);
        }
    }
};