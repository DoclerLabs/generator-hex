'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var inquirer = require('inquirer');
var fileHelper = require('../filehelper');

var cwd = process.cwd();

module.exports = yeoman.Base.extend({
    subGenerators: [
        new inquirer.Separator(chalk.yellow('------Files-----')),
        'module',
        'model',
        new inquirer.Separator(chalk.yellow('----Projects----')),
        'haxedevelop',
        'project'
    ],

    constructor: function () {
        yeoman.Base.apply(this, arguments);

        fileHelper.registerPackageOption(this);
    },


    initializing: function () {
        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the fabulous ' + chalk.red('hexMachina') + ' generator!\n\nWhat would you like to generate?'
        ));

        this.destinationRoot(cwd);
    },
    prompting: function () {
        var prompts = [{
            type: 'list',
            name: 'generator',
            message: 'Please choose a sub-generator to call:',
            choices: this.subGenerators
        }];

        this.prompt(prompts).then(function (values) {
            this.composeWith('hex:' + values.generator, {
                options: this.options
            });
        }.bind(this));
    }
});
