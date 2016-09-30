'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

var appName = 'hexGeneratorTest';
var packageName = 'org.hexmachina.hexgeneratortest';
var targetPlatform = 'neko';
var packagePath = 'src/org/hexmachina/hexgeneratortest';

describe('generator-hex:project', function () {
    before(function () {
        return helpers.run(path.join(__dirname, '../generators/project'))
            .withPrompts({
                appName: appName,
                packageName: packageName,
                targetPlatform: targetPlatform
            })
            .toPromise();
    });

    it('creates files', function () {
        var expected = [
            'build.hxml',
            'run.bat',
            packagePath + '/Main.hx',
            packagePath + '/configuration/context.xml',
            packagePath + '/configuration/ModuleConfiguration.xml',
            packagePath + '/configuration/ServiceConfiguration.xml',
            packagePath + '/configuration/ViewConfiguration.xml'
        ];
        assert.file(expected);
    });
});
