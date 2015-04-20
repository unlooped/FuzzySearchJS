"use strict";

/*
 * Module requirements go here
 */
var prime = require('prime');
var FSModule = require('./FSModule');
var lev = require('levenshtein');

var LevenshteinSimpleFS = prime({

	inherits: FSModule,

	name: 'LevenshteinSimpleFS',

	options: {
		'harshness': 1,
		'caseSensitive': false
	},

	/**
	 * Compares the two strings.
	 *
	 * @param {String} term
	 * @param {String} haystack
	 * @returns {LevenshteinSimpleFS}
	 */
	search: function (term, haystack) {

		this.lastTerm = term;
		this.lastHaystack = haystack;

		if (!this.options.caseSensitive) {
			term = term.toUpperCase();
			haystack = haystack.toUpperCase();
		}

		var score = lev(term, haystack);

		this.lastScore = score;

		return this;

	},

	/**
	 * Calculates the score of the previous search
	 *
	 * @returns {Number}
	 */
	getPoints: function () {

		var averageLength = (this.lastTerm.length + this.lastHaystack.length) / 2;

		return 100 * Math.pow(Math.E, -(this.options.harshness) * this.lastScore / averageLength);

	}

});

/**
 * A module for comparing two string with the
 * Levenshtein distance calculation. This is
 * a simpler version of the LevenshteinFS module.
 *
 * @see http://en.wikipedia.org/wiki/Levenshtein_distance
 *
 * @param {Object} options
 *  - harshness: The rate at which the score decreases in comparison to the distance
 *  - caseSensitive: Whether or not to calculate the distance case sensitively
 *
 */
module.exports = function (options) {
	return new LevenshteinSimpleFS(options);
};
