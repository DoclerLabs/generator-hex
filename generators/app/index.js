'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.Base.extend({
    initializing: function () {
        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the fabulous ' + chalk.red('hexMachina') + ' generator!'
        ));
        this.log("Please run one of the following sub-generators:");
        this.log(chalk.red("module"));
        this.log(chalk.red("model"));
        this.log(chalk.red("haxedevelop"));
        this.log(chalk.red("project"));
    }
});
