'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-hex:dsl', function () {
    before(function () {
        return helpers.run(path.join(__dirname, '../generators/dsl'))
            .withPrompts({
                fileNames: 'Test.xml,example/Test',
                rootTag: 'test'
            })
            .toPromise();
    });

    it('creates files', function () {
        var expected = [
            'Test.xml',
            'example/Test.xml'
        ];

        assert.file(expected);
    });
});
