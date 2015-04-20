"use strict";

var expect = require('expect.js');

var LevenshteinSimpleFS = require('./../../js/modules/LevenshteinSimpleFS');

describe('LevenshteinSimpleFS', function () {

	it('should accept no construct parameters correctly', function () {

		var module = new LevenshteinSimpleFS();

		expect(module.options).to.be.eql({});

	});

	it('should accept some construct parameters correctly', function () {

		var module = new LevenshteinSimpleFS({
			harshness: 14
		});

		expect(module.options).to.be.eql({
			harshness: 14
		});

	});

	it('should not have a lastScore initialised by default', function () {

		var module = new LevenshteinSimpleFS({
			caseSensitive: true
		});

		expect(module.lastScore).to.be.eql(undefined);

	});

	describe('search', function () {

		it('should correctly calculate the distance between two strings', function () {

			var module = new LevenshteinSimpleFS();

			module.search('hi there', 'hows your day');

			expect(module.lastScore).to.be.eql(10);

		});

		it('should correctly calculate the distance between two strings case insensitively ', function () {

			var module = new LevenshteinSimpleFS();

			module.search('hi there', 'HI THERE');

			expect(module.lastScore).to.be.eql(0);

		});

		it('should correctly calculate the distance between two strings case sensitively ', function () {

			var module = new LevenshteinSimpleFS({
				caseSensitive: true
			});

			module.search('hi there', 'HI THERE');

			expect(module.lastScore).to.be.eql(7);

		});

	});

	describe('getPoints', function () {

		it('should return the same score of 100 no matter what the harshness is if the string are equal', function () {

			[
				1,
				10,
				1000,
				25.4545
			].forEach(function (val) {

					var module = new LevenshteinSimpleFS({
						harshness: val
					});

					module.search('hi there', 'HI THERE');

					var result = module.getPoints();

					expect(result).to.be.eql(100);

				});

		});

		it('should return a pretty high score if the strings are only 1 character out', function () {

			var module = new LevenshteinSimpleFS({
				harshness: 1
			});

			module.search('hi there', 'h there');

			var result = module.getPoints();

			expect(result).to.be.eql(87.51733190429475);

		});

		it('should return a pretty high score if the strings are only 1 character out even if the strings are short', function () {

			var module = new LevenshteinSimpleFS({
				harshness: 1
			});

			module.search('hi the', 'h the');

			var result = module.getPoints();

			expect(result).to.be.eql(83.37529180751805);

		});

		it('should return a pretty high score if the strings are only 1 character out even if the strings are long', function () {

			var module = new LevenshteinSimpleFS({
				harshness: 1
			});

			module.search('hi there the fox and the cat', 'h there the fox and the cat');

			var result = module.getPoints();

			expect(result).to.be.eql(96.42895789647244);

		});

		it('should return a pretty mild score if the strings are only half matching', function () {

			var module = new LevenshteinSimpleFS({
				harshness: 1
			});

			module.search('hi there', 'ho tueoe');

			var result = module.getPoints();

			expect(result).to.be.eql(68.72892787909723);

		});

		it('should return a pretty mild score if the strings are only half out out even if the strings are short', function () {

			var module = new LevenshteinSimpleFS({
				harshness: 1
			});

			module.search('hi', 'ho');

			var result = module.getPoints();

			expect(result).to.be.eql(60.653065971263345);

		});

		it('should return a pretty mild score if the strings are only half out out even if the strings are long', function () {

			var module = new LevenshteinSimpleFS({
				harshness: 1
			});

			module.search('hi there the fox and the cat', 'ho tsete vht bon rnn hha oap');

			var result = module.getPoints();

			expect(result).to.be.eql(62.858393339862516);

		});

		it('pretty low score if the string aren\'t at all matching', function () {

			var module = new LevenshteinSimpleFS({
				harshness: 1
			});

			module.search('qwerty', 'asdfgh');

			var result = module.getPoints();

			expect(result).to.be.eql(36.787944117144235);

		});

		it('pretty low score if the string aren\'t at all matching even if the strings are long', function () {

			var module = new LevenshteinSimpleFS({
				harshness: 1
			});

			module.search('qwertyuiopqwertyuiop', 'asdfghjkasdfghjkzx');

			var result = module.getPoints();

			expect(result).to.be.eql(34.901807093132);

		});

		it('pretty low score if the string aren\'t at all matching even if the strings are short', function () {

			var module = new LevenshteinSimpleFS({
				harshness: 1
			});

			module.search('qw', 'as');

			var result = module.getPoints();

			expect(result).to.be.eql(36.787944117144235);

		});

	});

});
