'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.Base.extend({
  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the fabulous ' + chalk.red('hexMachina') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'appName',
      message: 'What is the application\'s name?',
      default: this.appname, // Default to current folder name
      store: true
    }, {
      type: 'input',
      name: 'packageName',
      message: 'What is the application\'s package name?',
      default: 'com.example.' + this.appname,
      store: true
    }];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;

      this.paths = {
        // We need to replace dots with slashes
        packagePath: 'src/' + this.props.packageName.replace(new RegExp('\\.', 'g'), '/')
      };

      this.config.set('props', this.props);
      this.config.set('paths', this.paths);
    }.bind(this));
  },

  writing: function () {
    var scope = {
      props: this.props,
      paths: this.paths
    };

    var packageFiles = [
      'Main.hx',
      'configuration/context.xml',
      'configuration/ModuleConfiguration.xml',
      'configuration/ServiceConfiguration.xml',
      'configuration/ViewConfigurationJS.xml'
    ];

    for (var file of packageFiles) {
      this.fs.copyTpl(this.templatePath('src/' + file), this.destinationPath(this.paths.packagePath + '/' + file), scope);
    }
  },

  install: function () {
    this.installDependencies();
  }
});
