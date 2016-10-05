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
            name: 'fileNames',
            validate: function (value) {
                if (value === '')
                    return 'File list cannot be empty.';

                var ret = true;
                helper.iterateCommaList(value, function (name) {
                    if (name === '')
                        ret = 'File list cannot contain empty filenames.';
                });

                return ret;
            },
            message: 'List DSL files (separated by commas):\n'
        }, {
            type: 'input',
            name: 'rootTag',
            message: 'What root tag should be used?',
            default: 'root'
        }];
        fileHelper.addCurrentPackagePrompt(this, prompts);

        return this.prompt(prompts).then(function (values) {
            this.props = values;
            this.files = [];

            helper.iterateCommaList(values.fileNames, function (fileName) {
                if (fileName === '')
                    return;

                var parts = fileName.split('/');
                var name = parts.pop();
                var pack = parts.join('/');

                if (!name.endsWith('.xml'))
                    name += '.xml';

                var fullPack = helper.joinIfNotEmpty([this.options.currentPackage, pack], '/');

                var file = {
                    name: name,
                    package: pack,
                    fullPackage: fullPack
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
                file: file,
                rootTag: this.props.rootTag
            };

            this.fs.copyTpl(
                this.templatePath('dsl.xml'),
                this.destinationPath(helper.joinIfNotEmpty([file.package, file.name], '/')),
                scope
            );
        }
    }
});
