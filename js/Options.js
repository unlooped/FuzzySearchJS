"use strict";

var prime = require('prime');

var Options = prime({
    
    setOptions: function(options) {
        if (!options) {
            return;
        }
        
        this.options = this.options || {};
        
        var Object = require('prime-util/types/object');
        this.options = Object.merge(this.options, options);
    }
    
});

module.exports = Options;