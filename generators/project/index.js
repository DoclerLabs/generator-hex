'use strict';
const yeoman = require('yeoman-generator');
const chalk = require('chalk');
const projHelper = require('../projecthelper');
const helper = require('../helper');
const spawn = require('child_process').spawn;

module.exports = yeoman.Base.extend({
    prompting: function () {
        var prompts = [{
            type: 'input',
            name: 'srcFolder',
            message: 'What is the application\'s source folder?', // TODO: validate if it's a correct folder name
            default: 'src'
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
            name: 'projectFiles',
            message: 'What kind of project files would you like to create?',
            default: 'none',
            choices: [{
                name: 'FlashDevelop project files',
                value: 'fd'
            }, {
                name: 'Haxe build files',
                value: 'hx'
            }, {
                name: 'None',
                value: 'none'
            }]
        }, {
            type: 'list',
            name: 'targetPlatform',
            message: 'What is your target platform?',
            when: function (answers) {
                return answers.projectFiles !== 'none';
            },
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
            var info = spawn('haxelib', [ 'path', 'hexmachina']);
            info.stdout.on('data', (data) => {
                if (data.toString().startsWith("Error")) {
                    this.prompt([{
                        type: 'confirm',
                        name: 'installHM',
                        message: 'You do not seem to have hexMachina installed, do you want me to install it?',
                        default: true
                    }]).then(function (props) {
                        if (props.installHM) {
                            var install = spawn('haxelib', ['install', 'hexmachina']);
                            install.stdout.on('data', (data) => {
                                this.log(data.toString());
                            });
                        }
                    }.bind(this));
                }
            });
            info.on('error', (e) => {
                this.log.error('Failed to run haxelib');
            });



            var mainPath = helper.joinIfNotEmpty([this.props.srcFolder, this.paths.packagePath, 'Main.hx'], '/');

            var scope = {
                props: this.props,
                paths: this.paths,
                appName: this.appname,
                mainPath: mainPath
            };

            var packageFiles = [
                'Main.hx',
                'configuration/context.xml',
                'configuration/ModuleConfiguration.xml',
                'configuration/ServiceConfiguration.xml',
                'configuration/ViewConfiguration.xml'
            ];
            for (var file of packageFiles)
                this.fs.copyTpl(this.templatePath('src/' + file), this.destinationPath('src/' + this.paths.packagePath + '/' + file), scope);

            if (this.props.projectFiles !== 'none') {
                projHelper.writeTargetTemplates(this, scope);

                if (this.props.projectFiles === 'hx')
                    this.fs.copyTpl(this.templatePath('build.hxml'), this.destinationPath('build.hxml'), scope);
                else if (this.props.projectFiles === 'fd')
                    this.fs.copyTpl(this.templatePath('Project.hxproj'), this.destinationPath(this.appname + '.hxproj'), scope);
            }
        }
    }
});
