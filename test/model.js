'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-hex:model', function () {
    before(function () {
        return helpers.run(path.join(__dirname, '../generators/model'))
            .withPrompts({
                modelNames: 'Test,example.Test'
            })
            .toPromise();
    });

    it('creates files', function () {
        var expected = [
            'TestModel.hx',
            'ITestModel.hx',
            'ITestModelListener.hx',
            'ITestModelRO.hx',
            'example/TestModel.hx',
            'example/ITestModel.hx',
            'example/ITestModelListener.hx',
            'example/ITestModelRO.hx'
        ];

        assert.file(expected);
    });
});
