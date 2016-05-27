'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

var appName = 'hexGeneratorTest';
var packageName = 'org.hexmachina.hexGeneratorTest';
var packagePath = 'org/hexmachina/hexGeneratorTest';

describe('generator-hex:app', function () {
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({
        appName: appName,
        packageName: packageName
      })
      .toPromise();
  });

  it('creates files', function () {
    var expected = [
      'src/' + packagePath + '/Main.hx',
      'src/' + packagePath + '/configuration/context.xml',
      'src/' + packagePath + '/configuration/ModuleConfiguration.xml',
      'src/' + packagePath + '/configuration/ServiceConfiguration.xml',
      'src/' + packagePath + '/configuration/ViewConfigurationJS.xml'
    ];
    assert.file(expected);
  });

  it('creates haxelib.json', function () {
    var expected = {
      name: 'hexGeneratorTest',
      version: '1.0.0',
      dependencies: {
        hexmachina: 'git:https://github.com/DoclerLabs/hexMachina.git'
      }
    };

    assert.jsonFileContent('haxelib.json', expected);
  });
});
