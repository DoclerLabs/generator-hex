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
            name: 'adapterNames',
            validate: fileHelper.validateCommaTypeList,
            message: 'List adapter strategy names (separated by commas):\n'
        }];
        fileHelper.addCurrentPackagePrompt(this, prompts);

        return this.prompt(prompts).then(function (values) {
            this.props = values;
            this.files = [];

            var promise = null;

            helper.iterateCommaList(values.adapterNames, function (adapterName) {
                if (adapterName === '')
                    return;

                var parts = adapterName.split('.');
                var name = parts.pop();
                var pack = parts.join('.');

                var fullPack = helper.joinIfNotEmpty([this.options.currentPackage, pack], '.');

                var prompts = [{
                    type: 'confirm',
                    name: 'injection',
                    message: 'Do you want to enable injection for ' + adapterName + ' ?',
                    default: false
                }];

                promise = helper.chainPrompts(this, promise, prompts).then(function (values) {
                    var injection = values.injection;

                    var file = {
                        name: name,
                        package: pack,
                        fullPackage: fullPack,
                        injector: injection
                    };

                    this.files.push(file);
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
                as: file
            };

            var files = new Map([
                ['AdapterStrategy.hx', file.name]
            ]);

            fileHelper.writeFilesToPackage(this, files, file.package, scope);
        }
    }
});
