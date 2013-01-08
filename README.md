FuzzySearchJS
=============

Prime Implementation for fuzzy searching

Just a proof of concept.

Todo:

- Implement own Levenshtein algorithm for improving performance. It's not neccessary to calculate the whole number everytime. You can calculate the first rows and everytime a new letter is added you can just calculate the next row. Also if your tolerance is reached you can stop calculate the other rows.
- Make it more abstract so you can use it with every dataset you like.
- Implement something to set the datapath(s) for the comparison
- Play around with factors for best results. Maybe some presets for different situations. It's a big difference if you make a live search or if you make a search with the full term.
- Take a closer look at Sift3 algorithm. Maybe there is also some potential for performance optimizations.
- Make it modular so other algorithms can be easily used.
- Implement caching for results
- Implement that the user choice can be transfered to server, so maybe this could also be a source.
- Implement that caching for the same resultset can be preloaded from server.
