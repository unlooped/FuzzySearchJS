"use strict";

var prime = require('prime');

var Options = prime({
    
    setOptions: function(options) {
        var object = require('prime-util/types/object');
        this.options = object.merge({}, this.options);
        
        if (!options) {
            return;
        }
        
        this.options = object.merge(this.options, options);
    }
    
});

module.exports = Options;