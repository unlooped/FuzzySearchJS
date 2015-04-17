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

					module.lastScore = 0;

					var result = module.getPoints();

					expect(result).to.be.eql(100);

				});

		});

		it('should return a score of less than 100 if the strings aren\'t equal', function () {

			var module = new LevenshteinSimpleFS({
				harshness: 1
			});

			module.lastScore = 10;

			var result = module.getPoints();

			expect(result).to.be.eql(9.090909090909092);

		});

	});

});
