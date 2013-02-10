"Use Strict";

var prime = require('prime');
var string = require('prime/shell/string');
var mixin = require('prime-util/prime/mixin');
var bound = require('prime-util/prime/bound');
var options = require('prime-util/prime/options');

var Arr = require('prime/es5/array');
var Obj = require('prime-util/shell/object');


var FuzzySearch = prime({

    modules: [],

    options: {
        'caseSensitive': false,
        'termPath': ''
    },

    constructor: function(searchSet, options) {
        this.setOptions(options);
        this.searchSet = searchSet;
    },

    addModule: function(mod) {
        this.modules.push(new mod.module(mod.options));
    },

    search: function(needle) {
        var needle = this.options.caseSensitive ? string.clean(needle).toLowerCase() : string.clean(needle);
        var result = [];

        Arr.forEach(this.searchSet, function(value) {
            var value = this.options.termPath.length == 0 ? value : Obj.getValueForPath(value, this.options.termPath);

            if (this.options.caseSensitive) {
                value = value.toLowerCase();
            }

            var score = this.getCombinedModulePoints(needle, value);
            result.push({'score': score.combined, 'details': score.details, 'value': value});
        }, this);

        return result.sort(function(a, b) {
            return b.score - a.score;
        });
    },

    getCombinedModulePoints: function(needle, haystack) {
        var result = {'combined': 0, 'details': []};
        Arr.forEach(this.modules, function(mod) {
            var score = mod.search(needle, haystack).getPoints();
            var name = mod.getName();
            var factor = mod.getFactor();

            result.combined += factor * score;
            result.details.push({'name': name, 'score': score, 'factor': factor});
        })

        return result;
    },

    getMaximumScore: function() {
        var factorSum = 0;
        Arr.forEach(this.modules, function(mod) {
            factorSum += mod.getFactor();
        });

        return 100 * factorSum;
    }

});


mixin(FuzzySearch, options, bound);

module.exports = FuzzySearch;