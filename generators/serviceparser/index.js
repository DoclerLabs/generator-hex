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
        helper.printTitle(this);

        var prompts = [{
            type: 'input',
            name: 'parserNames',
            validate: fileHelper.validateCommaTypeList,
            message: 'List parser names (separated by commas):\n'
        }];
        fileHelper.addCurrentPackagePrompt(this, prompts);

        return helper.prompt(this, prompts).then(function (values) {
            this.props = values;
            this.files = [];

            var promise = null;

            helper.iterateCommaList(values.parserNames, function (parserName) {
                if (parserName === '')
                    return;

                var parts = parserName.split('.');
                var name = parts.pop();
                var pack = parts.join('.');

                var fullPack = helper.joinIfNotEmpty([this.options.currentPackage, pack], '.');

                var prompts = [{
                    type: 'input',
                    name: 'returnType',
                    validate: function (value) {
                        if (!fileHelper.validateHaxeType(value)) {
                            return 'Not a valid type: "' + value + '"';
                        }
                        return true;
                    },
                    message: 'Please enter a return type:\n',
                    default: 'Dynamic'
                }];

                promise = helper.chainPrompts(this, promise, prompts).then(function (values) {
                    var file = {
                        name: name,
                        package: pack,
                        fullPackage: fullPack,
                        ServiceParser: name,
                        returnType: values.returnType
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
                parser: file
            };

            var files = [
                ['ServiceParser.hx', file.ServiceParser]
            ];

            fileHelper.writeFilesToPackage(this, new Map(files), file.package, scope);
        }


    }
});
