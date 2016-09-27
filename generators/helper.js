'use strict';
var yeoman = require('yeoman-generator');

module.exports = {
    typeRegex: /(([a-z]|\d|_)+\.)*[A-Z]\w*/,

    validateHaxeType: function (type) {
        var matched = type.match(this.typeRegex);
        return matched != null && matched[0].length == type.length;
    },
    iterateCommaList: function (list, callback) {
        var names = list.split(',');

        for (var name of names) {
            name = name.trim();
            callback(name);
        }
    },
    validateCommaTypeList: function (list) {
        var ret = true;
        module.exports.iterateCommaList(list, function(mod) {
            if (!module.exports.validateHaxeType(mod)) {
                ret = false;
            }
        }.bind(this));
        if (!ret)
            return "Not a valid type name: '" + mod + "'";

        return true;
    },
    parseFunctionHead: function (fun) {
        fun = fun.trim().replace (/\n/g, '');
        
        if (fun.endsWith(';'))
            fun = fun.substr(0, fun.length - 1);

        return fun;
    },
    parseFunctionHeadList: function (list) {
        var array = [];

        var list = list.replace(/\r/g, '\n').split('\n');
        for (var item of list) {
            var fun = module.exports.parseFunctionHead(item);
            if (fun != '') {
                array.push(fun);
            }
        }

        return array;
    }
};
