'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

var appName = 'hexGeneratorTest';
var packageName = 'org.hexmachina.hexGeneratorTest';

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
      'src/' + packageName + '/Main.hx',
      'src/' + packageName + '/configuration/context.xml',
      'src/' + packageName + '/configuration/ModuleConfiguration.xml',
      'src/' + packageName + '/configuration/ServiceConfiguration.xml',
      'src/' + packageName + '/configuration/ViewConfigurationJS.xml'
    ];
    assert.file(expected);
  });
});
