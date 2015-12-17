"Use Strict";

var prime = require('prime');
var FSModule = require('./FSModule');
var arr = {
	'forEach': require('prime/array/forEach')
};
var lev = require('levenshtein');

var LevenshteinFS = prime({

    inherits: FSModule,

    name: 'LevenshteinFS',
    options: {
        'maxDistanceTolerance': 3
    },

    search: function(term, haystack) {
        this.lastTerm = term;
        this.lastHaystack = haystack;

        var needleWords = term.split(' ');
        var haystackWords = haystack.split(' ');

        var matches = [];

        var nwl = needleWords.length;
        var hwl = haystackWords.length;
        for (var i = 0; i < hwl; i++) {
            var haystackWord = haystackWords[i];
            var best = this.options.maxDistanceTolerance + 1;
            for (var j = 0; j < nwl; j++) {
                var needleWord = needleWords[j];

                var score = lev(needleWord, haystackWord);

                if (score < best) {
                    best = score;
                }
            }
            matches.push(best);
        }

        this.lastResults = matches;

        return this;
    },

    getPoints: function() {
        var haystackWords = this.lastHaystack.split(' ');

        var combinedScore = this.lastResults.reduce(function(p, c) {
            return p + c;
        });

        var points = 50 / haystackWords.length * this.lastResults.length;
        points += 50 / (haystackWords.length * this.options.maxDistanceTolerance) * (haystackWords.length * this.options.maxDistanceTolerance - combinedScore);

        return points;
    }

});

module.exports = function(options) {return new LevenshteinFS(options);};

