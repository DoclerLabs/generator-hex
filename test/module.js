'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

var config = {
  props: {
    appName: 'hexGeneratorTest',
    packageName: 'org.hexmachina.hexGeneratorTest'
  },
  paths: {
    packagePath: 'org/hexmachina/hexGeneratorTest'
  }
};

describe('generator-hex:module', function () {
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/module'))
      .withLocalConfig(config)
      .withPrompts({
        moduleName: 'Test'
      })
      .toPromise();
  });

  // TODO: Make this test work
  it.skip('creates files', function () {
    var expected = [
      'src/org/hexmachina/hexGeneratorTest/module/test/TestModule.hx',
      'src/org/hexmachina/hexGeneratorTest/module/test/ITestModule.hx'
    ];

    assert.file(expected);
  });
});
