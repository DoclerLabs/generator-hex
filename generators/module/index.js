'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var fileHelper = require('../filehelper');
var helper = require('../helper');

var cwd = process.cwd();

module.exports = yeoman.Base.extend({
    constructor: function () {
        yeoman.Base.apply(this, arguments);

        fileHelper.registerPackageOption(this);
    },
    initializing: function () {
        this.destinationRoot(cwd);
    },
    prompting: function () {
        var prompts = [{
            type: 'input',
            name: 'moduleNames',
            validate: fileHelper.validateCommaTypeList,
            message: 'Please list module names (separated by commas):\n'
        }];
        fileHelper.addCurrentPackagePrompt(this, prompts);

        return this.prompt(prompts).then(function (values) {
            this.props = values;
            this.files = [];

            var promise = null;

            helper.iterateCommaList(values.moduleNames, function (moduleName) {
                if (moduleName === '')
                    return;

                var parts = moduleName.split('.');
                var name = parts.pop();
                var pack = parts.join('.');
                var originalName = name;

                if (!name.endsWith('Module'))
                    name += 'Module';

                if (pack === '')
                    pack = moduleName.toLowerCase();

                var fullPack = helper.joinIfNotEmpty([this.options.currentPackage, pack], '.');

                var prompts = [{
                    type: 'confirm',
                    name: 'moduleConfig',
                    message: 'Do you want to add a module config (mdvc specific)?',
                    default: false
                },{
                    type: 'confirm',
                    name: 'controller',
                    message: 'Do you want to add a controller of the same name?',
                    default: false
                },{
                    type: 'confirm',
                    name: 'model',
                    message: 'Do you want to add a model of the same name?',
                    default: false
                }];

                promise = helper.chainPrompts(this, promise, prompts,
                    '\n' + chalk.blue.underline.bold(name)).then(function (values) {

                    var moduleConfig = null;
                    if (values.moduleConfig) {
                        moduleConfig = name + 'Config';
                    }

                    if (values.controller) {
                        var controllerName = pack + '.controller.' + originalName + 'Controller';

                        this.composeWith('hex:controller', {
                            options: Object.assign({
                                controllerNames: controllerName,
                                ignoreNaming: true
                            }, this.options)
                        });
                    }

                    if (values.model) {
                        var modelName = pack + '.model.' + originalName + 'Model';

                        this.composeWith('hex:model', {
                            options: Object.assign({
                                modelNames: modelName,
                                ignoreNaming: true
                            }, this.options)
                        });
                    }

                    this.files.push({
                        name: name,
                        package: pack,
                        fullPackage: fullPack,
                        className: name,
                        moduleConfigName: moduleConfig,
                        Controller:     'controller.' + originalName + 'Controller',
                        IController:    'controller.I' + originalName + 'Controller',
                        Model:          'model.' + originalName + 'Model',
                        IModel:         'model.I' + originalName + 'Model',
                        interfaceName: 'I' + name
                    });
                }.bind(this));
            }.bind(this));

            return promise;
        }.bind(this));
    },

    writing: function () {
        for (var file of this.files) {
            var scope = {
                author: this.user.git.name(),
                package: file.fullPackage,
                className: file.className,
                interfaceName: file.interfaceName,
                moduleConfigName: file.moduleConfigName,
                Controller: file.Controller,
                IController: file.IController,
                Model: file.Model,
                IModel: file.IModel
            };

            var files = new Map([
                ['IModule.hx', file.interfaceName],
                ['Module.hx', file.className]
            ]);

            fileHelper.writeFilesToPackage(this, files, file.package, scope);
        }
    }
});
