"Use Strict";

var prime = require('prime');
var mixin = require('prime-util/prime/mixin');
var bound = require('prime-util/prime/bound');
var Options = require('./Options');

var list = require('prime/collection/list');
var string = require('prime/types/string');
var number = require('prime/types/number');


var lev = global.lev = require('levenshtein');

var FuzzySearch = prime({
    
    options: {
        'maxLevenshteinTolerance': 3,
        'maxWordTolerance': 3,
        'minTermLength': 3,
        'maxIterations': 500,
        'caseSensitive': false,
        'wordCountFactor': 1,
        'indexOfFactor': 3,
        'levenshteinFactor': 3
    },
    
    constructor: function(searchSet, options) {
        this.setOptions(options);
        this.searchSet = searchSet;
    },
    
    search: function(needle) {
        var needle = string.clean(needle);
        
        var result = [];
        list.each(this.searchSet, function(value) {
            var value = string.clean(value);
            var score = this.getOverallPoints(needle, value);
            result.push({'score': score.score, 'detailedScore': score.detailedScore,'value': value});
        }, this);
        
        return result.sort(function(a, b) {
            return b.score - a.score;
        });
    },
    
    getOverallPoints: function(needle, haystack) {
        
        if (!this.options.caseSensitive) {
            var needle = needle.toLowerCase();
            var haystack = haystack.toLowerCase();
        }
        
        if (needle == haystack) {
            return {'score': this.getMaximumScore(),
                    'detailedScore': {'indexPoints': 100 * this.options.indexOfFactor,
                                      'wordCountPoints': 100 * this.options.wordCountFactor,
                                      'levenshteinScore': 100 * this.options.levenshteinFactor}};
        }
        
        var indexOfMatches = this.getIndexOfMatches(needle, haystack);
        var indexPoints = this.getIndexOfPoints(indexOfMatches, needle);
        var wordCountPoints = this.getWordCountPoints(needle, haystack);
        var levenshteinMatches = this.getLevenshteinMatches(needle, haystack);
        var levenshteinScore = this.getLevenshteinScore(levenshteinMatches, haystack);
        
        return {'score': indexPoints * this.options.indexOfFactor
                         + wordCountPoints * this.options.wordCountFactor 
                         + levenshteinScore * this.options.levenshteinFactor,
                'detailedScore': {'indexPoints': indexPoints * this.options.indexOfFactor,
                                  'wordCountPoints': wordCountPoints * this.options.wordCountFactor, 
                                  'levenshteinScore': levenshteinScore * this.options.levenshteinFactor
                                  }
                };
    },
    
    getMaximumScore: function() {
        return 100 * (this.options.indexOfFactor + this.options.wordCountFactor + this.options.levenshteinFactor);
    },
    
    getIndexOfMatches: function(needle, haystack) {
        this.haystack = haystack;
        
        var minLength = needle.length >= this.options.minTermLength ? this.options.minTermLength : needle.length;
        
        var needle = needle;
        var matches = [];
        var iterations = 0;
        do {
            var cm = this.getClosestMatch(needle);
            if (cm.length >= minLength) {
                matches.push(cm);
            }
            
            var substrc = (cm.length - 1 > 0) ? cm.length : 1;
            needle = needle.substr(substrc);
            iterations++;
        } while (needle.length >= minLength && iterations <= this.options.maxIterations);
        
        
        return matches;
    },
    
    getIndexOfPoints: function(results, needle) {
        var sum = 0;
        list.each(results, function(result) {
            sum += result.length;
        });
        
        return 100 / needle.length * sum;
    },
    
    getLevenshteinMatches: function(needle, haystack) {
        var needleWords = needle.split(' ');
        var haystackWords = haystack.split(' ');
        
        var matches = [];
        
        var nwl = needleWords.length;
        var hwl = haystackWords.length;
        for (var i = 0; i < nwl; i++) {
            for (var j = 0; j < hwl; j++) {
                var needleWord = needleWords[i];
                var haystackWord = haystackWords[j];
                
                var score = lev(needleWord, haystackWord);
                if (score <= this.options.maxLevenshteinTolerance) {
                    matches.push({'match': needleWord, 'score': score});
                }
            }
        }
        
        return matches;
    },
    
    getLevenshteinScore: function(results, haystack) {
        var haystackWords = haystack.split(' ');
        
        var combinedScore = 0;
        list.each(results, function(result) {
            combinedScore += result.score;
        });
        
        combinedScore += (haystackWords.length - results.length) * this.options.maxLevenshteinTolerance;
        
        var points = 50 / haystackWords.length * results.length;
        points += 50 / (haystackWords.length * this.options.maxLevenshteinTolerance) * (haystackWords.length * this.options.maxLevenshteinTolerance - combinedScore);
        
        return points;
    },
    
    getWordCountPoints: function(needle, haystack) {
        var needleWords = needle.split(' ');
        var haystackWords = haystack.split(' ');
        
        return 100 / this.options.maxWordTolerance * (this.options.maxWordTolerance - number.limit(Math.abs(haystackWords.length - needleWords.length), 0, this.options.maxWordTolerance));
    },
    
    getClosestMatch: function(needle, haystack) {
        var haystack = this.haystack;
        
        if (haystack.indexOf(needle) != -1) {
            return needle;
        }
        
        var length = needle.length;
        var lastMatchingString = "";
        
        for (var i = 0; i <= length; i++) {
            var term = needle.substr(0, i);
            if (haystack.indexOf(term) != -1) {
                continue;
            }
            
            return term.substr(0, i - 1);
        }
        
        return "";
    },
});

mixin(FuzzySearch, Options, bound);

module.exports = FuzzySearch;