'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.Base.extend({
  initializing: function () {
    this.log(yosay(
      'Generating project files for ' + chalk.red('HaxeDevelop')
    ));
  },

  writing: {
    templates: function () {
      var mainPath = this.paths.packagePath + '/Main.hx';
      mainPath.replace(new RegExp('/', 'g'), '\\');

      var scope = {
        props: this.props,
        paths: this.paths,
        mainPath: mainPath
      };

      // Copy hxproj
      this.fs.copyTpl(this.templatePath('Project.hxproj'), this.destinationPath(this.props.appName + '.hxproj'), scope);
    },
    static: function () {
      // Copy assets
      this.fs.copy(this.templatePath('Project.png'), this.destinationPath(this.props.appName + '.png'));
      this.fs.copy(this.templatePath('Project.txt'), this.destinationPath(this.props.appName + '.txt'));
    }
  }
});
