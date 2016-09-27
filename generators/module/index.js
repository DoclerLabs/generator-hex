'use strict';
var yeoman = require('yeoman-generator');
var helper = require('../helper');

var cwd = process.cwd();

module.exports = yeoman.Base.extend({
    prompting: function () {
        var prompts = [{
            type: 'input',
            name: 'moduleNames',
            validate: helper.validateCommaTypeList,
            message: 'Please list module names (seperated by commas, including package):'
        }];

        return this.prompt(prompts).then(function (values) {
            this.props = values;
            this.files = [];

            helper.iterateCommaList(values.moduleNames, function (moduleName) {
                var parts = moduleName.split('.');
                var name = parts.pop();
                if (!name.endsWith("Module")) {
                    name += "Module";
                }
                var pack = parts.join(".");

                if (moduleName === "") {
                    return;
                }

                this.files.push({
                    name: name,
                    package: pack,
                    className: name,
                    interfaceName: "I" + name
                });
            }.bind(this));
        }.bind(this));
    },

    writing: function () {
        for (var file of this.files) {
            var scope = {
                author: this.user.git.name(),
                package: file.package,
                className: file.className,
                interfaceName: file.interfaceName,
            };
            this.fs.copyTpl(
                this.templatePath('IModule.hx'),
                this.destinationPath(cwd + "/" + file.package.replace(/\./g, "/") + "/" + file.interfaceName + ".hx"),
                scope
            );
            this.fs.copyTpl(
                this.templatePath('Module.hx'),
                this.destinationPath(cwd + "/" + file.package.replace(/\./g, "/") + "/" + file.className + ".hx"),
                scope
            );
        }
    }
});
