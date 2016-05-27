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

describe('generator-hex:app', function () {
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/haxedevelop'))
      .withLocalConfig(config)
      .toPromise();
  });

  it('creates files', function () {
    var expected = [
      'hexGeneratorTest.hxproj',
      'hexGeneratorTest.png',
      'hexGeneratorTest.txt'
    ];

    assert.file(expected);
  });
});
