'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.Base.extend({
    prompting: function () {
        var prompts = [{
            type: 'input',
            name: 'appName',
            message: 'What is the application\'s name?',
            default: this.appname, // Default to current folder name
        }, {
            type: 'input',
            name: 'packageName',
            message: 'What is the application\'s package name?',
            default: 'com.example.' + this.appname,
        }, {
            type: 'list',
            name: 'targetPlatform',
            message: 'Please choose a target platform',
            default: 'js',
            choices: [
                'js',
                'flash',
                'neko'
            ]
        }];

        return this.prompt(prompts).then(function (props) {
            // To access props later use this.props.someAnswer;
            this.props = props;

            this.paths = {
                // We need to replace dots with slashes
                packagePath: 'src/' + this.props.packageName.replace(new RegExp('\\.', 'g'), '/')
            };
        }.bind(this));
    },

    writing: {
        templates: function () {
            var scope = {
                props: this.props,
                paths: this.paths
            };
            if (this.props.targetPlatform === "js") {
                scope.targetOption = "-js bin/main.js";
                this.fs.copyTpl(this.templatePath('bin/js.html'), this.destinationPath('bin/index.html'), scope);
            }
            else if (this.props.targetPlatform === "flash") {
                scope.targetOption = "-swf bin/main.swf";
                this.fs.copyTpl(this.templatePath('bin/flash.html'), this.destinationPath('bin/index.html'), scope);
            }
            else if (this.props.targetPlatform === "neko") {
                scope.targetOption = "-neko bin/main.n";
                this.fs.copyTpl(this.templatePath('neko.bat'), this.destinationPath('run.bat'), scope);
            }

            var packageFiles = [
                'Main.hx',
                'configuration/context.xml',
                'configuration/ModuleConfiguration.xml',
                'configuration/ServiceConfiguration.xml',
                'configuration/ViewConfigurationJS.xml'
            ];
            for (var file of packageFiles) {
                this.fs.copyTpl(this.templatePath('src/' + file), this.destinationPath('src/' + this.paths.packagePath + '/' + file), scope);
            }

            this.fs.copyTpl(this.templatePath('build.hxml'), this.destinationPath('build.hxml'), scope);
        }
    }
});
