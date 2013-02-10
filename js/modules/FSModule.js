"Use Strict";

var prime = require('prime');
var mixin = require('prime-util/prime/mixin');
var bound = require('prime-util/prime/bound');
var options = require('prime-util/prime/options');

var FSModule = prime({

    lastTerm: '',
    lastHaystack: '',
    lastResults: [],

    options: {
        'factor': 1
    },

    constructor: function(options) {
        this.setOptions(options);
    },

    search: function(searchTerm) {
        throw "search method not implemented";
    },

    getPoints: function() {
        throw "getPoints method not implemented";
    },

    getMatches: function() {
        return this.lastResults;
    },

    getFactor: function() {
        return this.options.factor || 1;
    },

    getName: function() {
        if (!this.name) throw "set module name!";

        return this.name;
    }

});

mixin(FSModule, bound, options);

module.exports = FSModule;