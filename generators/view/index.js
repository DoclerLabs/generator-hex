'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var fileHelper = require('../filehelper');
var helper = require('../helper');

var cwd = process.cwd();

module.exports = yeoman.Base.extend({
    constructor: function () {
        yeoman.Base.apply(this, arguments);

        this.option('currentPackage', {
            type: String,
            defaults: null
        });
    },
    initializing: function () {
        this.runByPlugin = fileHelper.checkPluginCall(this);

        this.destinationRoot(cwd);
    },
    prompting: function () {
        var prompts = [{
            type: 'input',
            name: 'modelNames',
            validate: fileHelper.validateCommaTypeList,
            message: 'List model names (seperated by commas, including package):'
        }];

        return this.prompt(prompts).then(function (values) {
            this.props = values;
            this.files = [];

            helper.iterateCommaList(values.modelNames, function (modelName) {
                if (modelName === '')
                    return;

                var parts = modelName.split('.');
                var name = parts.pop();
                var pack = parts.join('.');

                if (!name.endsWith('Model'))
                    name += 'Model';

                if (this.runByPlugin)
                    pack = 'model' + pack;

                var file = {
                    name: name,
                    package: pack,
                    Model: name,
                    IModel: 'I' + name,
                    IModelListener: 'I' + name + 'Listener',
                    IModelRO: 'I' + name + 'RO',
                    ModelDispatcher: name + 'Dispatcher'
                };

                this.files.push(file);
            }.bind(this));

        }.bind(this));
    },

    writing: function () {
        for (var file of this.files) {
            var pack = file.package;
            if (this.runByPlugin)
                pack = this.options.currentPackage + '.' + pack;
            var scope = {
                author: this.user.git.name(),
                package: pack,
                model: file
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
