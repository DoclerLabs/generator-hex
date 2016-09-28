'use strict';
var yeoman = require('yeoman-generator');

module.exports = {
    typeRegex: /(([a-z]|\d|_)+\.)*[A-Z]\w*/,
    packRegex: /([a-z\d]+\.)+[a-z\d]+/,

    /** Generates some files for execution and modifies the scope according to target */
    writeTargetTemplates: function (generator, scope) {
        if (scope.props.targetPlatform === "js") {
            scope.platform = 'JavaScript';
            scope.testMovie = 'Webserver';
            scope.testMovieCommand = 'bin/index.html';
            scope.targetOption = "-js bin/main.js";
            scope.targetPath = 'bin/main.js';

            generator.fs.copyTpl(generator.templatePath('bin/js.html'), generator.destinationPath('bin/index.html'), scope);
        }
        else if (scope.props.targetPlatform === "flash") {
            scope.platform = 'Flash Player';
            scope.testMovie = 'Webserver';
            scope.testMovieCommand = 'bin/index.html';
            scope.targetOption = "-swf bin/main.swf";
            scope.targetPath = 'bin/main.swf';

            generator.fs.copyTpl(generator.templatePath('bin/flash.html'), generator.destinationPath('bin/index.html'), scope);
        }
        else if (scope.props.targetPlatform === "neko") {
            scope.platform = 'Neko';
            scope.testMovie = 'OpenDocument';
            scope.testMovieCommand = 'run.bat';
            scope.targetOption = "-neko bin/main.n";
            scope.targetPath = 'bin/main.n';

            generator.fs.copyTpl(generator.templatePath('neko.bat'), generator.destinationPath('run.bat'), scope);
        }
    },

    /** Checks whether the given string is a valid Haxe type path (e.g: com.example2.Test) */
    validateHaxeType: function (type) {
        var matched = type.match(this.typeRegex);
        return matched != null && matched[0].length == type.length;
    },
    /** Checks whether the given string is a valid Haxe package (e.g: com.example.test2) */
    validateHaxePackage: function (pack) {
        if (pack == "")
            return true;

        var matched = pack.match(this.packRegex);
        return matched != null && matched[0].length == pack.length;
    },

    /** Parses a comma-separated list and iterates through all elements, calling callback for each of them */
    iterateCommaList: function (list, callback) {
        var names = list.split(',');

        for (var name of names) {
            name = name.trim();
            callback(name);
        }
    },
    /** Calls iterateCommaList and uses validateHaxeType on every element.
     * Returns true if all elements are valid, returns an error message otherwise */
    validateCommaTypeList: function (list) {
        var ret = true;
        module.exports.iterateCommaList(list, function(mod) {
            if (!module.exports.validateHaxeType(mod)) {
                ret = false;
            }
        }.bind(this));
        if (!ret)
            return "Not a valid type name: '" + mod + "'";

        return true;
    },

    parseFunctionHead: function (fun) {
        fun = fun.trim().replace (/\n/g, '');

        if (fun.endsWith(';'))
            fun = fun.substr(0, fun.length - 1);

        return fun;
    },
    parseFunctionHeadList: function (list) {
        var array = [];

        var lst = list.replace(/\r/g, '\n').split('\n');
        for (var item of lst) {
            var fun = module.exports.parseFunctionHead(item);
            if (fun != '') {
                array.push(fun);
            }
        }

        return array;
    }
};
