"use strict";

var prime = require('prime');
var object = require('prime-util/types/object');

var Options = prime({
    
    setOptions: function(options) {
        var args = [{}, this.options];
        args.push.apply(args, arguments);
        this.options = object.merge.apply(null, args);
        
        if (!options) {
            return;
        }
        
        this.options = object.merge(this.options, options);
    }
    
});

module.exports = Options;