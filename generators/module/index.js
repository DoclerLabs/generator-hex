'use strict';
var yeoman = require('yeoman-generator');
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
        if (this.options.currentPackage !== null)
            this.runByPlugin = true;
        else
            this.runByPlugin = false;

        this.destinationRoot(cwd);
    },
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
                if (moduleName === '')
                    return;

                var parts = moduleName.split('.');
                var name = parts.pop();
                var pack = parts.join('.');

                if (!name.endsWith('Module'))
                    name += 'Module';

                if (pack == '')
                    pack = moduleName.toLowerCase();

                this.files.push({
                    name: name,
                    package: pack,
                    className: name,
                    interfaceName: 'I' + name
                });
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
                className: file.className,
                interfaceName: file.interfaceName
            };

            var packPath = file.package.replace(/\./g, '/') + '/';

            this.fs.copyTpl(
                this.templatePath('IModule.hx'),
                this.destinationPath(packPath + file.interfaceName + '.hx'),
                scope
            );
            this.fs.copyTpl(
                this.templatePath('Module.hx'),
                this.destinationPath(packPath + file.className + '.hx'),
                scope
            );
        }
    }
});
