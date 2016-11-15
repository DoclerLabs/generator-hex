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

                if (!name.endsWith('Module'))
                    name += 'Module';

                if (pack === '')
                    pack = moduleName.toLowerCase();

                var fullPack = helper.joinIfNotEmpty([this.options.currentPackage, pack], '.');

                var prompts = [{
                    type: 'confirm',
                    name: 'createInterface',
                    message: 'Do you want to add a controller?',
                    default: false
                }];

                promise = helper.chainPrompts(this, promise, prompts).then(function (values) {
                    if (values.serviceParser) {
                        this.composeWith('hex:controller', {
                            options: Object.assign({
                                controllerNames: pack + '.controller.' + name + 'Controller',
                                ignoreNaming: true
                            }, this.options)
                        });
                    }

                    this.files.push({
                        name: name,
                        package: pack,
                        fullPackage: fullPack,
                        className: name,
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
                interfaceName: file.interfaceName
            };

            var files = new Map([
                ['IModule.hx', file.interfaceName],
                ['Module.hx', file.className]
            ]);

            fileHelper.writeFilesToPackage(this, files, file.package, scope);
        }
    }
});
