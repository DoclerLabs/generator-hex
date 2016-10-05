'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-hex:viewhelper', function () {
    before(function () {
        return helpers.run(path.join(__dirname, '../generators/viewhelper'))
            .withPrompts({
                currentPackage: '',
                viewNames: 'Test,example.TestView, example.ExampleViewHelper'
            })
            .toPromise();
    });

    it('creates files', function () {
        var expected = [
            'TestViewHelper.hx',
            'ITestView.hx',
            'example/TestViewHelper.hx',
            'example/ITestView.hx',
            'example/ExampleViewHelper.hx',
            'example/IExampleView.hx'
        ];

        assert.file(expected);
    });
});
