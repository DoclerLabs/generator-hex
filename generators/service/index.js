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
            name: 'serviceNames',
            validate: fileHelper.validateCommaTypeList,
            message: 'List service names (separated by commas):\n'
        }, {
            type: 'list',
            name: 'serviceType',
            message: 'Please choose a service type:\n',
            choices: [
                'HttpService',
                'Stateful',
                'AsyncStateless'
            ]
        }, {
            type: 'confirm',
            name: 'createInterface',
            message: 'Do you want to implement an interface?',
            default: false
        }, {
            type: 'input',
            name: 'interfaceName',
            validate: fileHelper.validateHaxeType,
            message: 'Please enter an interface name:\n'
        }];
        fileHelper.addCurrentPackagePrompt(this, prompts);

        return this.prompt(prompts).then(function (values) {
            this.props = values;
            this.files = [];

            helper.iterateCommaList(values.serviceNames, function (serviceName) {
                if (serviceName === '')
                    return;

                var parts = serviceName.split('.');
                var name = parts.pop();
                var pack = parts.join('.');
                var endPack = 'service.' + name.toLowerCase();

                if (!this.options.currentPackage.endsWith(endPack) && !pack.startsWith(endPack))
                    pack = helper.joinIfNotEmpty([endPack, pack], '.');

                var fullPack = helper.joinIfNotEmpty([this.options.currentPackage, pack], '.');

                var file = {
                    name: name,
                    package: pack,
                    fullPackage: fullPack,
                    Service: name,
                    serviceType: this.props.serviceType,
                    hasInterface: values.createInterface
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
                service: file,
                createInterface: file.hasInterface
            };

            var files = [];

            if (file.serviceType === 'Stateful')
                files.push(['StatefulService.hx', file.Service]);
            else if (file.serviceType === 'AsyncStateless')
                files.push(['AsyncStateless.hx', file.Service]);
            else if (files.serviceType === 'HttpService')
                files.push(['HttpService.hx', file.Service]);

            fileHelper.writeFilesToPackage(this, new Map(files), file.package, scope);
        }
    }
});
