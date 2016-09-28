'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var helper = require('../helper');

var cwd = process.cwd();

var chainPrompt = function (promise, promptFun, preCallback, thenCallback) {
    if (promise != undefined) {
        promise = promise.then (function (result) {
            if (preCallback != null)
                preCallback();

            return promptFun().then(thenCallback);
        }.bind(this));
    } else {
        if (preCallback != null)
            preCallback();

        promise = promptFun().then(thenCallback);
    }
    return promise;
};

module.exports = yeoman.Base.extend({
    initializing: function () {
        this.destinationRoot(cwd);
    },
    prompting: {
        basic: function () {
            var prompts = [{
                type: 'input',
                name: 'modelNames',
                validate: helper.validateCommaTypeList,
                message: 'List model names (seperated by commas, including package):'
            }];

            return this.prompt(prompts).then(function (values) {
                this.props = values;
                this.files = [];

                helper.iterateCommaList(values.modelNames, function (modelName) {
                    var parts = modelName.split('.');
                    var name = parts.pop();
                    var pack = parts.join('.');

                    if (!name.endsWith('Model')) {
                        name += 'Model';
                    }

                    if (modelName === '') {
                        return;
                    }

                    this.files.push({
                        fullName: modelName,
                        name: name,
                        package: pack,
                        Model: name,
                        IModel: 'I' + name,
                        IModelListener: 'I' + name + 'Listener',
                        IModelRO: 'I' + name + 'RO',
                        ModelDispatcher: name + 'Dispatcher',
                        functionsIModelRO: [],
                        functionsIModel: [],
                        functionsIModelListener: []
                    });
                }.bind(this));

            }.bind(this));
        },
        askFunctions: function () {
            var promise;
            for (var file of this.files) {
                var prompt = [{
                    type: 'confirm',
                    name: 'generateFunctions',
                    message: 'Would you like to generate some functions for ' + chalk.green(file.fullName) + '?',
                    default: false
                }, {
                    type: 'editor',
                    name: 'getterFunctions',
                    message: 'Write getter functions:',
                    default: 'function getSomething() : Something',
                    when: function (responses) { return responses.generateFunctions }
                }, {
                    type: 'editor',
                    name: 'setterFunctions',
                    message: 'Write setter functions:',
                    default: 'function setSomething(v : Something)',
                    when: function (responses) { return responses.generateFunctions }
                }, {
                    type: 'editor',
                    name: 'listenerFunctions',
                    message: 'Write listener functions:',
                    default: 'function onSomethingHappened(v : Something)',
                    when: function (responses) { return responses.generateFunctions }
                }];

                promise = chainPrompt(promise,
                    function () { //promptFun
                        return this.prompt(prompt);
                    }.bind(this),
                    null,
                    function (functions) { //thenCallback
                        if (functions.generateFunctions) {
                            this.functionsIModelRO = helper.parseFunctionHeadList(functions.getterFunctions);
                            this.functionsIModel = helper.parseFunctionHeadList(functions.setterFunctions);
                            this.functionsIModelListener = helper.parseFunctionHeadList(functions.listenerFunctions);
                        }
                    }.bind(file)
                );
            }

            return promise;
        }
    },

    writing: function () {
        for (var file of this.files) {
            var scope = {
                author: this.user.git.name(),
                package: file.package,
                model: file,
                functionsIModelRO: file.functionsIModelRO,
                functionsIModel: file.functionsIModel,
                functionsIModelListener: file.functionsIModelListener
            };

            var packPath = file.package.replace(/\./g, '/') + '/';

            this.fs.copyTpl(
                this.templatePath('Model.hx'),
                this.destinationPath(packPath + file.Model + '.hx'),
                scope
            );
            this.fs.copyTpl(
                this.templatePath('IModel.hx'),
                this.destinationPath(packPath + file.IModel + '.hx'),
                scope
            );
            this.fs.copyTpl(
                this.templatePath('IModelListener.hx'),
                this.destinationPath(packPath + file.IModelListener + '.hx'),
                scope
            );
            this.fs.copyTpl(
                this.templatePath('IModelRO.hx'),
                this.destinationPath(packPath + file.IModelRO + '.hx'),
                scope
            );
        }
    }
});
