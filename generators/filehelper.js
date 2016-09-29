'use strict';
var helper = require('./helper');

module.exports = {
    typeRegex: /(([a-z]|\d|_)+\.)*[A-Z]\w*/,

    writeFilesToPackage: function (generator, files, pack, scope) {
        for (var [template, inPack] of files.entries()) {
            generator.fs.copyTpl(
                generator.templatePath(template),
                generator.destinationPath(module.exports.getFilePath(pack, inPack)),
                scope
            );
        }
    },

    registerPackageOption: function (generator) {
        generator.option('currentPackage', {
            type: String,
            defaults: null
        });
    },

    getFilePath: function (pack, module) {
        var packPath = pack.replace(/\./g, '/');

        return helper.joinIfNotEmpty([packPath, module + '.hx'], '/');
    },

    checkPluginCall: function (generator) {
        return generator.options.currentPackage !== null;
    },

    /** Checks whether the given string is a valid Haxe type path (e.g: com.example2.Test) */
    validateHaxeType: function (type) {
        var matched = type.match(this.typeRegex);
        return matched != null && matched[0].length == type.length;
    },

    /** Calls iterateCommaList and uses validateHaxeType on every element.
     * Returns true if all elements are valid, returns an error message otherwise */
    validateCommaTypeList: function (list) {
        var ret = true;
        helper.iterateCommaList(list, function(mod) {
            if (!module.exports.validateHaxeType(mod)) {
                ret = false;
            }
        }.bind(this));
        if (!ret)
            return "Not a valid type name: '" + mod + "'";

        return true;
    }
};
