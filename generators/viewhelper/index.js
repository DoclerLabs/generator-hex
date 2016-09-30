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
                var view = name;
                var pack = parts.join('.');

                if (name.endsWith('View')) {
                    name += 'Helper';
                } else if (name.endsWith('ViewHelper')) {
                    view = name.substr(0, name.length - 6);
                } else {
                    name += 'ViewHelper';
                    view += 'View';
                }

                var fullPack = pack;
                if (this.runByPlugin) {
                    if (!this.options.currentPackage.endsWith('view') && !pack.startsWith('view'))
                        pack = helper.joinIfNotEmpty(['view', pack], '.');

                    fullPack = helper.joinIfNotEmpty([this.options.currentPackage, pack], '.');
                }

                var file = {
                    name: name,
                    package: pack,
                    fullPackage: fullPack,
                    IView: 'I' + view,
                    ViewHelper: name
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
                view: file
            };

            var files = new Map([
                ['IView.hx', file.IView],
                ['ViewHelper.hx', file.ViewHelper]
            ]);

            fileHelper.writeFilesToPackage(this, files, file.package, scope);
        }
    }
});
