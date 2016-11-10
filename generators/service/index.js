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
        this.destinationRoot(cwd);
    },
    prompting: function () {
        var prompts = [{
            type: 'input',
            name: 'serviceNames',
            validate: fileHelper.validateCommaTypeList,
            message: 'List service names (separated by commas):\n'
        }];
        fileHelper.addCurrentPackagePrompt(this, prompts);

        return this.prompt(prompts).then(function (values) {
            this.props = values;
            this.files = [];

            var promise = null;

            helper.iterateCommaList(values.serviceNames, function (serviceName) {
                if (serviceName === '')
                    return;

                var parts = serviceName.split('.');
                var name = parts.pop();
                var pack = parts.join('.');
                var endPack = 'service.' + name.toLowerCase(); //TODO: make this a little smarter

                if (!this.options.currentPackage.endsWith(endPack) && !pack.startsWith(endPack))
                    pack = helper.joinIfNotEmpty([endPack, pack], '.');

                var fullPack = helper.joinIfNotEmpty([this.options.currentPackage, pack], '.');

                var prompts = [{
                    type: 'list',
                    name: 'serviceType',
                    message: 'Please choose a service type for ' + serviceName + ':\n',
                    choices: [
                        'Http',
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
                    validate: function (value) {
                        if (!fileHelper.validateHaxeType(value)) {
                            return 'Not a valid interface name: "' + value + '"';
                        }
                        return true;
                    },
                    message: 'Please enter an interface name:\n',
                    when: function (values) {
                        return values.createInterface;
                    }
                }, {
                    type: 'confirm',
                    name: 'serviceParser',
                    message: 'Do you want to create a parser?',
                    default: true,
                    when: function (values) {
                        return values.serviceType === 'Http';
                    }
                }];

                promise = helper.chainPrompts(this, promise, prompts).then(function (values) {
                    if (values.serviceParser) {
                        this.composeWith('hex:serviceparser', {
                            options: Object.assign({
                                parserNames: pack + '.' + name + 'Parser',
                                title: '\n' + chalk.blue.underline.bold('ServiceParser for ' + name)
                            }, this.options)
                        }); //TODO: create HttpParser generator
                    }

                    var file = {
                        name: name,
                        package: pack,
                        fullPackage: fullPack,
                        Service: name,
                        serviceType: values.serviceType,
                        hasInterface: values.createInterface,
                        IService: values.interfaceName
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
                service: file
            };

            var files = [];

            if (file.serviceType === 'Stateful')
                files.push(['StatefulService.hx', file.Service]);
            else if (file.serviceType === 'AsyncStateless')
                files.push(['AsyncStatelessService.hx', file.Service]);
            else if (file.serviceType === 'Http')
                files.push(['HttpService.hx', file.Service]);

            fileHelper.writeFilesToPackage(this, new Map(files), file.package, scope);
        }


    }
});
