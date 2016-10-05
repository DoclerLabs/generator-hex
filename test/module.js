'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-hex:module', function () {
    before(function () {
        return helpers.run(path.join(__dirname, '../generators/module'))
            .withPrompts({
                currentPackage: '',
                moduleNames: 'Test,example.Test'
            })
            .toPromise();
    });

    it('creates files', function () {
        var expected = [
            'test/TestModule.hx',
            'test/ITestModule.hx',
            'example/TestModule.hx',
            'example/ITestModule.hx'
        ];

        assert.file(expected);
    });
});
