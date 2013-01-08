"Use Strict";

var prime = require('prime');
var mixin = require('prime-util/prime/mixin');
var bound = require('prime-util/prime/bound');
var Options = require('./Options');

var list = require('prime/collection/list');
var string = require('prime/types/string');
var number = require('prime/types/number');

var lev = require('levenshtein');
var sift3 = require('./Sift3');

var FuzzySearch = prime({
    
    options: {
        'maxDistanceTolerance': 3,
        'maxWordTolerance': 3,
        'minTermLength': 3,
        'maxIterations': 500,
        'caseSensitive': false,
        'wordCountFactor': 1,
        'indexOfFactor': 3,
        'distanceFactor': 3,
        'distanceMethod': 1 // this.CONST['DISTANCE_METHOD_LEVENSHTEIN']
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
                                      'distanceScore': 100 * this.options.distanceFactor}};
        }
        
        var indexOfMatches = this.getIndexOfMatches(needle, haystack);
        var indexPoints = this.getIndexOfPoints(indexOfMatches, needle);
        var wordCountPoints = this.getWordCountPoints(needle, haystack);
        
        var distanceMatches = this.getDistanceMatches(needle, haystack);
        var distanceScore = this.getDistanceScore(distanceMatches, haystack);
        
        return {'score': indexPoints * this.options.indexOfFactor
                         + wordCountPoints * this.options.wordCountFactor 
                         + distanceScore * this.options.distanceFactor,
                'detailedScore': {'indexPoints': indexPoints * this.options.indexOfFactor,
                                  'wordCountPoints': wordCountPoints * this.options.wordCountFactor, 
                                  'distanceScore': distanceScore * this.options.distanceFactor
                                  }
                };
    },
    
    getMaximumScore: function() {
        return 100 * (this.options.indexOfFactor + this.options.wordCountFactor + this.options.distanceFactor);
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
    
    getDistanceMatches: function(needle, haystack) {
        var needleWords = needle.split(' ');
        var haystackWords = haystack.split(' ');
        
        if (this.CONST['DISTANCE_METHOD_SIFT3'] == this.options.distanceMethod && !this.sift3) {
            this.sift3 = new sift3(haystack);
        } else if (this.sift3) {
            this.sift3.setHaystack(haystack);
        }
        
        var matches = [];
        
        var nwl = needleWords.length;
        var hwl = haystackWords.length;
        for (var i = 0; i < nwl; i++) {
            for (var j = 0; j < hwl; j++) {
                var needleWord = needleWords[i];
                var haystackWord = haystackWords[j];
                
                var score;
                if (this.CONST['DISTANCE_METHOD_LEVENSHTEIN'] == this.options.distanceMethod) {
                    score = lev(needleWord, haystackWord);
                } else if (this.CONST['DISTANCE_METHOD_SIFT3'] == this.options.distanceMethod) {
                    score = this.sift3.getDifference(needleWord);
                }
                
                if (score <= this.options.maxDistanceTolerance) {
                    matches.push({'match': needleWord, 'score': score});
                }
            }
        }
        
        return matches;
    },
    
    getDistanceScore: function(results, haystack) {
        var haystackWords = haystack.split(' ');
        
        var combinedScore = 0;
        list.each(results, function(result) {
            combinedScore += result.score;
        });
        
        combinedScore += (haystackWords.length - results.length) * this.options.maxDistanceTolerance;
        
        var points = 50 / haystackWords.length * results.length;
        points += 50 / (haystackWords.length * this.options.maxDistanceTolerance) * (haystackWords.length * this.options.maxDistanceTolerance - combinedScore);
        
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

FuzzySearch.CONST = FuzzySearch.prototype.CONST = {'DISTANCE_METHOD_LEVENSHTEIN': 1, 'DISTANCE_METHOD_SIFT3': 2};

mixin(FuzzySearch, Options, bound);

module.exports = FuzzySearch;