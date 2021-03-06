'use strict';

module.exports = {
    packRegex: /([a-z\d]+\.)*[a-z\d]+/,

    printTitle: function (generator, title) {
        generator.option('title');

        title = title || generator.options.title;
        if (title !== undefined && title !== null) {
            generator.log(title);
        }

    },

    /** Makes yeoman ask for prompts after the given promise succeeded. promise can be null.
     * After the prompts succeeded, the then function is called
     * @returns Promise a new promise
     */
    chainPrompts: function (generator, promise, prompts, title) {
        if (promise === null) {
            module.exports.printTitle(generator, title);
            promise = module.exports.prompt(generator, prompts);
        }
        else {
            promise = promise.then(function () {
                module.exports.printTitle(generator, title);
                return module.exports.prompt(generator, prompts);
            });
        }

        return promise;
    },

    /** Prompts the user for the given prompts, except if they were passed as options */
    prompt: function (generator, prompts) {
        var filteredPrompts = [];
        var answers = {};

        for (var prompt of prompts) {
            generator.option(prompt.name);
            var opt = generator.options[prompt.name];

            if (opt !== undefined && opt !== null) //option found
                answers[prompt.name] = opt;
            else
                filteredPrompts.push(prompt);
        }

        return new Promise(function (resolve, reject) {
            if (filteredPrompts.length > 0) {
                generator.prompt(filteredPrompts).then(function (values) {
                    for (var p in answers) {
                        values[p] = answers[p];
                    }

                    resolve(values);
                });
            }
            else {
                resolve(answers);
            }
        });
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
