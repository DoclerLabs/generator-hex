'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var helper = require('../helper');

module.exports = yeoman.Base.extend({
    initializing: function () {
        this.log(yosay(
            'Generating project files for ' + chalk.red('HaxeDevelop')
        ));
    },
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
                if (helper.validateHaxePackage(input))
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

        return this.prompt(prompts).then(function (values) {
            this.props = values;

            this.paths = {
                packagePath: values.packageName.replace(/\./g, '/')
            };
        }.bind(this));
    },

    writing: {
        templates: function () {
            var mainPath = 'src/' + this.paths.packagePath + '/Main.hx';
            mainPath.replace(new RegExp('/', 'g'), '\\');

            var scope = {
                props: this.props,
                paths: this.paths,
                mainPath: mainPath
            };

            helper.writeTargetTemplates(this, scope);

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

            // Copy hxproj
            this.fs.copyTpl(this.templatePath('Project.hxproj'), this.destinationPath(this.props.appName + '.hxproj'), scope);
        },
        static: function () {
            // Copy assets
            this.fs.copy(this.templatePath('Project.txt'), this.destinationPath(this.props.appName + '.txt'));
        }
    }
});
