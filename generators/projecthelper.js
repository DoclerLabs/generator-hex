'use strict';
var helper = require('./helper');

module.exports = {
    getProjectPromts: function (defaultName) {
        return [{
            type: 'input',
            name: 'appName',
            message: 'What is the application\'s name?',
            default: defaultName // Default to current folder name
        }, {
            type: 'input',
            name: 'packageName',
            validate: function (input) {
                if (helper.validateHaxePackage(input))
                    return true;

                return 'Invalid package: "' + input + '"';
            },
            message: 'What is the application\'s package name?'
        }, {
            type: 'list',
            name: 'targetPlatform',
            message: 'What is your target platform?',
            default: 'js',
            choices: [
                'js',
                'flash',
                'neko'
            ]
        }];
    },

    /** Generates some files for execution and modifies the scope according to target (only used by project generators) */
    writeTargetTemplates: function (generator, scope) {
        if (scope.props.targetPlatform === 'js') {
            scope.platform = 'JavaScript';
            scope.testMovie = 'Webserver';
            scope.testMovieCommand = 'bin/index.html';
            scope.targetOption = '-js bin/main.js';
            scope.targetPath = 'bin/main.js';

            generator.fs.copyTpl(generator.templatePath('bin/js.html'), generator.destinationPath('bin/index.html'), scope);
        } else if (scope.props.targetPlatform === 'flash') {
            scope.platform = 'Flash Player';
            scope.testMovie = 'Webserver';
            scope.testMovieCommand = 'bin/index.html';
            scope.targetOption = '-swf bin/main.swf';
            scope.targetPath = 'bin/main.swf';

            generator.fs.copyTpl(generator.templatePath('bin/flash.html'), generator.destinationPath('bin/index.html'), scope);
        } else if (scope.props.targetPlatform === 'neko') {
            scope.platform = 'Neko';
            scope.testMovie = 'OpenDocument';
            scope.testMovieCommand = 'run.bat';
            scope.targetOption = '-neko bin/main.n';
            scope.targetPath = 'bin/main.n';

            generator.fs.copyTpl(generator.templatePath('neko.bat'), generator.destinationPath('run.bat'), scope);
        }
    }

};
