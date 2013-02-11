FuzzySearchJS
=============

Prime Implementation for fuzzy searching

## About: ##

FuzzySearchJS provides a easy and modular way for fuzzy searching in JS for multiple purposes.

## Todo: ##

- Add tests
- Add makefile
- Implement own Levenshtein algorithm for improving performance. It's not neccessary to calculate the whole number everytime. You can calculate the first rows and everytime a new letter is added you can just calculate the next row. Also if your tolerance is reached you can stop calculate the other rows.
- Play around with factors for best results. Maybe some presets for different situations. It's a big difference if you make a live search or if you make a search with the full term.
- Take a closer look at Sift3 algorithm. Maybe there is also some potential for performance optimizations.
- Implement caching for results
- Implement that the user choice can be transfered to server, so maybe this could also be a source.
- Implement that caching for the same resultset can be preloaded from server.
- Make better examples and better readme

## How to (just some thoughts / mindstorming) ##
```js
var dataSet = ['Hydrogen','Helium','Lithium','Beryllium','Boron','Carbon','Nitrogen','Oxygen','Fluorine','Neon','Sodium','Magnesium','Aluminum, Aluminium','Silicon','Phosphorus','Sulfur','Chlorine','Argon','Potassium','Calcium','Scandium','Titanium','Vanadium','Chromium','Manganese','Iron','Cobalt','Nickel','Copper','Zinc','Gallium','Germanium','Arsenic','Selenium','Bromine','Krypton','Rubidium','Strontium','Yttrium','Zirconium','Niobium','Molybdenum','Technetium','Ruthenium','Rhodium','Palladium','Silver','Cadmium','Indium','Tin','Antimony','Tellurium','Iodine','Xenon','Cesium','Barium','Lanthanum','Cerium','Praseodymium','Neodymium','Promethium','Samarium','Europium','Gadolinium','Terbium','Dysprosium','Holmium','Erbium','Thulium','Ytterbium','Lutetium','Hafnium','Tantalum','Tungsten','Rhenium','Osmium','Iridium','Platinum','Gold','Mercury','Thallium','Lead','Bismuth','Polonium','Astatine','Radon','Francium','Radium','Actinium','Thorium','Protactinium','Uranium','Neptunium','Plutonium','Americium','Curium','Berkelium','Californium','Einsteinium','Fermium','Mendelevium','Nobelium','Lawrencium','Rutherfordium','Dubnium','Seaborgium','Bohrium','Hassium','Meitnerium','Darmstadtium','Roentgenium','Copernicium','Ununtrium','Flerovium','Ununpentium','Livermorium','Ununseptium','Ununoctium'];
```


First you have to create a new FuzzySearch instance:

```js
var FuzzySearch = require('./FuzzySearch');
var fuzzySearch = new FuzzySearch(dataSet, {'caseSensitive': false});
```

Now you should add some modules you like to use. At the moment the following are available:

- IndexOf Search
- Levenshtein
- Sift3 – similar to levenshtein
- word count

```js
var LevenshteinFS = require('./modules/LevenshteinFS');
var IndexOfFS = require('./modules/IndexOfFS');
var WordCountFS = require('./modules/WordCountFS');

fuzzySearch.addModule({'module': LevenshteinFS, 'options': {'maxDistanceTolerance': 3, 'factor': 3}});
fuzzySearch.addModule({'module': IndexOfFS, 'options': {'minTermLength': 3, 'maxIterations': 500, 'factor': 3}});
fuzzySearch.addModule({'module': WordCountFS, 'options': {'maxWordTolerance': 3, 'factor': 1}});
```

Now you are ready to go:

```js
fuzzySearch.search('Hlium');
```

Returns an array like this:

```js
[
    {"score":590,
     "details":[
        {"name":"LevenshteinFS","score":83.33333333333334,"factor":3},
        {"name":"IndexOfFS","score":80,"factor":3},
        {"name":"WordCountFS","score":100,"factor":1}
     ],
     "value":"Helium"},
     {"score":490,
      "details":[
        {"name":"LevenshteinFS","score":50,"factor":3},
        {"name":"IndexOfFS","score":80,"factor":3},
        {"name":"WordCountFS","score":100,"factor":1}
      ],
      "value":"Gallium"},
      ...
```

Like ou see you get an overall score which indicates how close the match is.
You also get an array with more details, you see in there the score of every module and the factor by which the score is multiplied.
And for sure, in the "value" field you will find the value from the dataset.

## Objects ##

You can also search through objects. Just pass an array with objects as your dataset and set a "termPath" as option when instanciation FuzzySearch:

```js
var dataSet = [{'id': 1, 'demo': {'element': 'Hydrogen'}}, {'id': 2, 'demo': {'element': 'Helium'}}, {'id': 3, 'demo': {'element': 'Lithium'}}];
var fuzzySearch = new FuzzySearch(dataSet, {'caseSensitive': false, 'termPath': 'demo.element'});
```

Now your result would look something like this:

```js
[
    {"score":590,
     "details":[
        {"name":"LevenshteinFS","score":83.33333333333334,"factor":3},
        {"name":"IndexOfFS","score":80,"factor":3},
        {"name":"WordCountFS","score":100,"factor":1}
     ],
     "value": {'id': 1, 'demo': {'element': 'Hydrogen'}}},
     {"score":490,
      "details":[
        {"name":"LevenshteinFS","score":50,"factor":3},
        {"name":"IndexOfFS","score":80,"factor":3},
        {"name":"WordCountFS","score":100,"factor":1}
      ],
      "value":{'id': 2, 'demo': {'element': 'Helium'}}}
```