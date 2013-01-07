FuzzySearchJS
=============

Prime Implementation for fuzzy searching

Just a proof of concept.

Todo:

- Implement own Levenshtein algorithm for improving performance. It's not neccessary to calculate the whole number everytime. You can calculate the first rows and everytime a new letter is added you can just calculate the next row. Also if your tolerance is reached you can stop calculate the other rows.
- Make it more abstract so you can use it with every dataset you like.
- Implement something to set the datapath(s) for the comparison
- Play around with factors for best results. Maybe some presets for different situations. It's a big difference if you make a live search or if you make a search with the full term.