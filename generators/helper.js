'use strict';

module.exports = {
    packRegex: /([a-z\d]+\.)*[a-z\d]+/,

    /** Makes yeoman ask for prompts after the given promise succeeded. promise can be null.
     * After the prompts succeeded, the then function is called
     * @returns Promise a new promise
     */
    chainPrompts: function (generator, promise, prompts, then) {
        if (promise === null) {
            promise = generator.prompt(prompts).then(then);
        }
        else {
            promise = promise.then(function () {
                return generator.prompt(prompts).then(then);
            });
        }

        return promise;
    },

    /** Checks whether the given string is a valid Haxe package (e.g: com.example.test2) */
    validateHaxePackage: function (pack) {
        if (pack === null || pack === undefined)
            return false;

        if (pack === '')
            return true;

        var matched = pack.match(this.packRegex);
        return matched !== null && matched[0].length === pack.length;
    },

    /** Parses a comma-separated list and iterates through all elements, calling callback for each of them */
    iterateCommaList: function (list, callback) {
        var names = list.split(',');

        for (var name of names) {
            name = name.trim();
            callback(name);
        }
    },

    joinIfNotEmpty(strings, separator) {
        var result = [];
        for (var str of strings) {
            if (str !== '' && str !== null && str !== undefined)
                result.push(str);
        }
        return result.join(separator);
    }
};
