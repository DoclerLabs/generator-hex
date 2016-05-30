'use strict';
var yeoman = require('yeoman-generator');

module.exports = yeoman.Base.extend({
  initializing: function () {
    this.props = this.config.get('props');
    this.paths = this.config.get('paths');
  },

  prompting: function () {
    var prompts = [{
      type: 'input',
      name: 'moduleName',
      message: 'What is the module\'s name? (CamelCase without module suffix)'
    }];

    return this.prompt(prompts).then(function (values) {
      this.moduleName = values.moduleName;
      this.package = this.props.packageName + '.module.' + this.moduleName.toLowerCase();
      this.interfaceName = 'I' + this.moduleName;
      this.modulePath = this.paths.packagePath + '/module/' + this.moduleName.toLowerCase() + '/';
    }.bind(this));
  },

  configuring: function () {

  },

  writing: function () {
    var scope = {
      author: this.user.git.name(),
      package: this.package,
      interfaceName: this.interfaceName,
      className: this.moduleName
    };

    // Interface
    this.fs.copyTpl(
      this.templatePath('IModule.hx'),
      this.destinationPath(this.modulePath + this.interfaceName + 'Module.hx'),
      scope
    );

    // Class
    this.fs.copyTpl(
      this.templatePath('Module.hx'),
      this.destinationPath(this.modulePath + this.moduleName + 'Module.hx'),
      scope
    );
  }
});
