'use strict';
var yeoman = require('yeoman-generator');
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
            name: 'controllerNames',
            validate: fileHelper.validateCommaTypeList,
            message: 'List controller names (separated by commas):\n'
        }];
        fileHelper.addCurrentPackagePrompt(this, prompts);

        return this.prompt(prompts).then(function (values) {
            this.props = values;
            this.files = [];

            helper.iterateCommaList(values.controllerNames, function (controllerName) {
                if (controllerName === '')
                    return;

                var parts = controllerName.split('.');
                var name = parts.pop();
                var pack = parts.join('.');

                if (!name.endsWith('Controller'))
                    name += 'Controller';

                if (!this.options.currentPackage.endsWith('controller') && !pack.startsWith('controller'))
                    pack = helper.joinIfNotEmpty(['controller', pack], '.');

                var fullPack = helper.joinIfNotEmpty([this.options.currentPackage, pack], '.');

                var file = {
                    name: name,
                    package: pack,
                    fullPackage: fullPack,
                    IController: 'I' + name,
                    Controller: name
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
                controller: file
            };

            var files = new Map([
                ['IController.hx', file.IController],
                ['Controller.hx', file.Controller]
            ]);

            fileHelper.writeFilesToPackage(this, files, file.package, scope);
        }
    }
});
