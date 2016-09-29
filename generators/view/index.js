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
        this.runByPlugin = fileHelper.checkPluginCall(this);

        this.destinationRoot(cwd);
    },
    prompting: function () {
        var prompts = [{
            type: 'input',
            name: 'viewNames',
            validate: fileHelper.validateCommaTypeList,
            message: 'List view names (separated by commas, including package):'
        }];

        return this.prompt(prompts).then(function (values) {
            this.props = values;
            this.files = [];

            helper.iterateCommaList(values.viewNames, function (viewName) {
                if (viewName === '')
                    return;

                var parts = viewName.split('.');
                var name = parts.pop();
                var pack = parts.join('.');

                if (!name.endsWith('View'))
                    name += 'View';

                var fullPack = pack;
                if (this.runByPlugin) {
                    if (!this.options.currentPackage.endsWith('view')) {
                        pack = helper.joinIfNotEmpty(['view', pack], '.');
                    }

                    fullPack = helper.joinIfNotEmpty([this.options.currentPackage, pack], '.');
                }

                var file = {
                    name: name,
                    package: pack,
                    fullPackage: fullPack,
                    View: name,
                    ViewHelper: 'I' + name
                };

                this.files.push(file);
            }.bind(this));

        }.bind(this));
    },

    writing: function () {
        for (var file of this.files) {
            var scope = {
                author: this.user.git.name(),
                package: file.fullPackage,
                model: file
            };
            
            this.fs.copyTpl(
                this.templatePath('Model.hx'),
                this.destinationPath(fileHelper.getFilePath(file.package, file.Model)),
                scope
            );
            this.fs.copyTpl(
                this.templatePath('IModel.hx'),
                this.destinationPath(fileHelper.getFilePath(file.package, file.IModel)),
                scope
            );
            this.fs.copyTpl(
                this.templatePath('IModelListener.hx'),
                this.destinationPath(fileHelper.getFilePath(file.package, file.IModelListener)),
                scope
            );
            this.fs.copyTpl(
                this.templatePath('IModelRO.hx'),
                this.destinationPath(fileHelper.getFilePath(file.package, file.IModelRO)),
                scope
            );
        }
    }
});
