"Use Strict";

var prime = require('prime');
var onDomReady = require('elements/lib/domready');

var $$ = require("elements");
require('elements/lib/attributes');
require('elements/lib/events');
require('elements/lib/delegation');
require('elements/lib/insertion');
require('elements/lib/traversal');
var empty = require('elements-util/lib/empty'); // I dunno why it's not implemented in elements. Take a deeper look later...



var zen = require('elements/lib/zen')

var mixin = require('prime-util/prime/mixin');
var bound = require('prime-util/prime/bound');
var list = require('prime/collection/list');

var FuzzySearch = require('./FuzzySearch');

onDomReady(function() {
    new Main();
});

var Main = prime({
    
    constructor: function() {
        this.searchField = $$('#searchfield');
        this.levFuzzySearch = new FuzzySearch(fsData);
        this.sift3FuzzySearch = new FuzzySearch(fsData, {'distanceMethod': FuzzySearch.CONST['DISTANCE_METHOD_SIFT3']});
        
        $$('#maxscore').text(this.levFuzzySearch.getMaximumScore());
        
        this.loadEvents();
        this.displayData();
    },
    
    loadEvents: function() {
        this.searchField.on('keyup', this.bound('search'));
    },
    
    displayData: function() {
        var container = $$('#data');
        list.each(fsData, function(data) {
            zen('li').text(data).insert(container);
        });
    },
    
    displayResults: function(results, container) {
        var container = container;
        empty(container).empty(); // WA, implement empty in elements...
        
        list.each(results, function(result) {
            zen('li').text(result.value + ' ('+result.score+')').insert(container);
        });
    },
    
    search: function() {
        var term = this.searchField.value();
        var levResults = this.levFuzzySearch.search(term);
        var sift3Results = this.sift3FuzzySearch.search(term);
        
        this.displayResults(levResults, $$('#results'));
        this.displayResults(sift3Results, $$('#siftResults'));
    }
    
    
});

mixin(Main, bound);