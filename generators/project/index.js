'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var projHelper = require('../projecthelper');

module.exports = yeoman.Base.extend({
    prompting: function () {
        var prompts = [{
            type: 'input',
            name: 'appName',
            message: 'What is the application\'s name?',
            default: this.appname // Default to current folder name
        }, {
            type: 'input',
            name: 'packageName',
            validate: function (input) {
                if (projHelper.validateHaxePackage(input))
                    return true;

                return "Invalid package: '" + input + "'";
            },
            default: 'com.example.' + this.appname,
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

        return this.prompt(prompts).then(function (props) {
            // To access props later use this.props.someAnswer;
            this.props = props;

            this.paths = {
                // We need to replace dots with slashes
                packagePath: this.props.packageName.replace(new RegExp('\\.', 'g'), '/')
            };
        }.bind(this));
    },

    writing: {
        templates: function () {
            var scope = {
                props: this.props,
                paths: this.paths
            };

            projHelper.writeTargetTemplates(this, scope);

            var packageFiles = [
                'Main.hx',
                'configuration/context.xml',
                'configuration/ModuleConfiguration.xml',
                'configuration/ServiceConfiguration.xml',
                'configuration/ViewConfiguration.xml'
            ];
            for (var file of packageFiles) {
                this.fs.copyTpl(this.templatePath('src/' + file), this.destinationPath('src/' + this.paths.packagePath + '/' + file), scope);
            }

            this.fs.copyTpl(this.templatePath('build.hxml'), this.destinationPath('build.hxml'), scope);
        }
    }
});
