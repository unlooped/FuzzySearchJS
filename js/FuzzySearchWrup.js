(function(modules) {
    var cache = {}, require = function(id) {
        var module = cache[id];
        if (!module) {
            module = cache[id] = {};
            var exports = module.exports = {};
            modules[id].call(exports, require, module, exports, window);
        }
        return module.exports;
    };
    require("0")
})({
    "0": function(require, module, exports, global) {
                "Use Strict";

        var prime = require("1");

        var onDomReady = require("2");

        var $$ = require("4");

        require("8");

        require("3");

        require("b");

        require("h");

        require("d");

        var empty = require("i");

        // I dunno why it's not implemented in elements. Take a deeper look later...
        var zen = require("v");

        var mixin = require("w");

        var bound = require("x");

        var list = require("z");

        var FuzzySearch = require("10");

        onDomReady(function() {
            new Main();
        });

        var Main = prime({
            constructor: function() {
                this.searchField = $$("#searchfield");
                console.log(FuzzySearch.prototype);
                this.levFuzzySearch = new FuzzySearch(fsData);
                this.sift3FuzzySearch = new FuzzySearch(fsData, {
                    distanceMethod: FuzzySearch.CONST["DISTANCE_METHOD_SIFT3"]
                });
                $$("#maxscore").text(this.levFuzzySearch.getMaximumScore());
                this.loadEvents();
                this.displayData();
            },
            loadEvents: function() {
                this.searchField.on("keyup", this.bound("search"));
            },
            displayData: function() {
                var container = $$("#data");
                list.each(fsData, function(data) {
                    zen("li").text(data).insert(container);
                });
            },
            displayResults: function(results, container) {
                var container = container;
                empty(container).empty();
                // WA, implement empty in elements...
                list.each(results, function(result) {
                    zen("li").text(result.value + " (" + result.score + ")").insert(container);
                });
            },
            search: function() {
                var term = this.searchField.value();
                var levResults = this.levFuzzySearch.search(term);
                var sift3Results = this.sift3FuzzySearch.search(term);
                this.displayResults(levResults, $$("#results"));
                this.displayResults(sift3Results, $$("#siftResults"));
            }
        });

        mixin(Main, bound);
    },
    "1": function(require, module, exports, global) {
        /*
prime
 - prototypal inheritance
*/
                "use strict";

        var has = function(self, key) {
            return Object.hasOwnProperty.call(self, key);
        };

        var each = function(object, method, context) {
            for (var key in object) if (method.call(context, object[key], key, object) === false) break;
            return object;
        };

        /*(es5 && fixEnumBug)?*/
        if (!{
            valueOf: 0
        }.propertyIsEnumerable("valueOf")) {
            // fix stupid IE enum 🐛
            var buggy = "constructor,toString,valueOf,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString".split(","), proto = Object.prototype;
            each = function(object, method, context) {
                var i = buggy.length, key, value;
                for (key in object) if (method.call(context, object[key], key, object) === false) return object;
                while (i--) {
                    key = buggy[i];
                    value = object[key];
                    if (value !== proto[key] && method.call(context, value, key, object) === false) break;
                }
                return object;
            };
        }

        /*:*/
        var create = Object.create || function(self) {
            var F = function() {};
            F.prototype = self;
            return new F();
        };

        /*:*/
        var mutator = function(key, value) {
            this.prototype[key] = value;
        };

        var implement = function(obj) {
            each(obj, function(value, key) {
                if (key !== "constructor" && key !== "inherits" && key !== "mutator") this.mutator(key, value);
            }, this);
            return this;
        };

        var prime = function(proto) {
            var superprime = proto.inherits, superproto;
            if (superprime) superproto = superprime.prototype;
            // if our nice proto object has no own constructor property
            // then we proceed using a ghosting constructor that all it does is
            // call the parent's constructor if it has a superprime, else an empty constructor
            // proto.constructor becomes the effective constructor
            var constructor = has(proto, "constructor") ? proto.constructor : superprime ? function() {
                return superproto.constructor.apply(this, arguments);
            } : function() {};
            if (superprime) {
                // inherit from superprime
                var cproto = constructor.prototype = create(superproto);
                // setting constructor.parent to superprime.prototype
                // because it's the shortest possible absolute reference
                constructor.parent = superproto;
                cproto.constructor = constructor;
            }
            // inherit (kindof inherit) mutator
            constructor.mutator = proto.mutator || superprime && superprime.mutator || mutator;
            // copy implement (this should never change)
            constructor.implement = implement;
            // finally implement proto and return constructor
            return constructor.implement(proto);
        };

        prime.each = each;

        prime.has = has;

        prime.create = create;

        module.exports = prime;
    },
    "2": function(require, module, exports, global) {
        /*
domready
*/
                "use strict";

        var $ = require("3");

        var readystatechange = "onreadystatechange" in document, shouldPoll = false, loaded = false, readys = [], checks = [], ready = null, timer = null, test = document.createElement("div"), doc = $(document), win = $(window);

        var domready = function() {
            if (timer) timer = clearTimeout(timer);
            if (!loaded) {
                if (readystatechange) doc.off("readystatechange", check);
                doc.off("DOMContentLoaded", domready);
                win.off("load", domready);
                loaded = true;
                for (var i = 0; ready = readys[i++]; ) ready();
            }
            return loaded;
        };

        var check = function() {
            for (var i = checks.length; i--; ) if (checks[i]()) return domready();
            return false;
        };

        var poll = function() {
            clearTimeout(timer);
            if (!check()) timer = setTimeout(poll, 1e3 / 60);
        };

        if (document.readyState) {
            // use readyState if available
            var complete = function() {
                return !!/loaded|complete/.test(document.readyState);
            };
            checks.push(complete);
            if (!complete()) {
                // unless dom is already loaded
                if (readystatechange) doc.on("readystatechange", check); else shouldPoll = true;
            } else {
                // dom is already loaded
                domready();
            }
        }

        if (test.doScroll) {
            // also use doScroll if available (doscroll comes before readyState "complete")
            // LEGAL DEPT:
            // doScroll technique discovered by, owned by, and copyrighted to Diego Perini http://javascript.nwbox.com/IEContentLoaded/
            // testElement.doScroll() throws when the DOM is not ready, only in the top window
            var scrolls = function() {
                try {
                    test.doScroll();
                    return true;
                } catch (e) {}
                return false;
            };
            // If doScroll works already, it can't be used to determine domready
            // e.g. in an iframe
            if (!scrolls()) {
                checks.push(scrolls);
                shouldPoll = true;
            }
        }

        if (shouldPoll) poll();

        // make sure that domready fires before load, also if not onreadystatechange and doScroll and DOMContentLoaded load will fire
        doc.on("DOMContentLoaded", domready);

        win.on("load", domready);

        module.exports = function(ready) {
            loaded ? ready() : readys.push(ready);
            return null;
        };
    },
    "3": function(require, module, exports, global) {
        /*
events
*/
                "use strict";

        var $ = require("4"), prime = require("1"), Emitter = require("7");

        var html = document.documentElement;

        var addEventListener = html.addEventListener ? function(node, event, handle) {
            node.addEventListener(event, handle, false);
            return handle;
        } : function(node, event, handle) {
            node.attachEvent("on" + event, handle);
            return handle;
        };

        var removeEventListener = html.removeEventListener ? function(node, event, handle) {
            node.removeEventListener(event, handle, false);
        } : function(node, event, handle) {
            node.detachEvent("on" + event, handle);
        };

        $.implement({
            on: function(event, handle) {
                this.forEach(function(node) {
                    var self = $(node);
                    Emitter.prototype.on.call(self, event, handle);
                    var domListeners = self._domListeners || (self._domListeners = {});
                    if (!domListeners[event]) domListeners[event] = addEventListener(node, event, function(e) {
                        self.emit(event, e || window.event);
                    });
                });
                return this;
            },
            off: function(event, handle) {
                this.forEach(function(node) {
                    var self = $(node);
                    var domListeners = self._domListeners, domEvent, listeners = self._listeners, events;
                    if (domListeners && (domEvent = domListeners[event]) && listeners && (events = listeners[event])) {
                        Emitter.prototype.off.call(self, event, handle);
                        var empty = true, k, l;
                        for (k in events) {
                            empty = false;
                            break;
                        }
                        if (empty) {
                            removeEventListener(node, event, domEvent);
                            delete domListeners[event];
                            for (l in domListeners) empty = false;
                            if (empty) delete self._domListeners;
                        }
                    }
                });
                return this;
            },
            emit: function(event) {
                var args = arguments;
                this.forEach(function(node) {
                    Emitter.prototype.emit.apply($(node), args);
                });
                return this;
            }
        });

        module.exports = $;
    },
    "4": function(require, module, exports, global) {
        /*
elements
*/
                "use strict";

        var prime = require("1"), array = require("5").prototype;

        // uniqueID
        var uniqueIndex = 0;

        var uniqueID = function(n) {
            return n === global ? "global" : n.uniqueNumber || (n.uniqueNumber = "n:" + (uniqueIndex++).toString(36));
        };

        var instances = {};

        // elements prime
        var $ = prime({
            constructor: function $(n, context) {
                if (n == null) return this && this.constructor === $ ? new elements() : null;
                var self = n;
                if (n.constructor !== elements) {
                    self = new elements();
                    var uid;
                    if (typeof n === "string") {
                        if (!self.search) return null;
                        self[self.length++] = context || document;
                        return self.search(n);
                    }
                    if (n.nodeType || n === global) {
                        self[self.length++] = n;
                    } else if (n.length) {
                        // this could be an array, or any object with a length attribute,
                        // including another instance of elements from another interface.
                        var uniques = {};
                        for (var i = 0, l = n.length; i < l; i++) {
                            // perform elements flattening
                            var nodes = $(n[i], context);
                            if (nodes && nodes.length) for (var j = 0, k = nodes.length; j < k; j++) {
                                var node = nodes[j];
                                uid = uniqueID(node);
                                if (!uniques[uid]) {
                                    self[self.length++] = node;
                                    uniques[uid] = true;
                                }
                            }
                        }
                    }
                }
                if (!self.length) return null;
                // when length is 1 always use the same elements instance
                if (self.length === 1) {
                    uid = uniqueID(self[0]);
                    return instances[uid] || (instances[uid] = self);
                }
                return self;
            }
        });

        var elements = prime({
            inherits: $,
            constructor: function elements() {
                this.length = 0;
            },
            unlink: function() {
                return this.map(function(node, i) {
                    delete instances[uniqueID(node)];
                    return node;
                });
            },
            // straight es5 prototypes (or emulated methods)
            forEach: array.forEach,
            map: array.map,
            filter: array.filter,
            every: array.every,
            some: array.some
        });

        module.exports = $;
    },
    "5": function(require, module, exports, global) {
        /*
array
 - es5 array shell
*/
                "use strict";

        var shell = require("6");

        var proto = Array.prototype;

        var array = shell({
            filter: proto.filter || function(fn, context) {
                var results = [];
                for (var i = 0, l = this.length >>> 0; i < l; i++) if (i in this) {
                    var value = this[i];
                    if (fn.call(context, value, i, this)) results.push(value);
                }
                return results;
            },
            indexOf: proto.indexOf || function(item, from) {
                for (var l = this.length >>> 0, i = from < 0 ? Math.max(0, l + from) : from || 0; i < l; i++) {
                    if (i in this && this[i] === item) return i;
                }
                return -1;
            },
            map: proto.map || function(fn, context) {
                var length = this.length >>> 0, results = Array(length);
                for (var i = 0, l = length; i < l; i++) {
                    if (i in this) results[i] = fn.call(context, this[i], i, this);
                }
                return results;
            },
            forEach: proto.forEach || function(fn, context) {
                for (var i = 0, l = this.length >>> 0; i < l; i++) {
                    if (i in this) fn.call(context, this[i], i, this);
                }
            },
            every: proto.every || function(fn, context) {
                for (var i = 0, l = this.length >>> 0; i < l; i++) {
                    if (i in this && !fn.call(context, this[i], i, this)) return false;
                }
                return true;
            },
            some: proto.some || function(fn, context) {
                for (var i = 0, l = this.length >>> 0; i < l; i++) {
                    if (i in this && fn.call(context, this[i], i, this)) return true;
                }
                return false;
            }
        });

        array.isArray = Array.isArray || function(self) {
            return Object.prototype.toString.call(self) === "[object Array]";
        };

        /*:*/
        var methods = {};

        var names = "pop,push,reverse,shift,sort,splice,unshift,concat,join,slice,lastIndexOf,reduce,reduceRight".split(",");

        for (var i = 0, name, method; name = names[i++]; ) if (method = proto[name]) methods[name] = method;

        array.implement(methods);

        module.exports = array;
    },
    "6": function(require, module, exports, global) {
        /*
shell 🐚
*/
                "use strict";

        var prime = require("1"), slice = Array.prototype.slice;

        var shell = prime({
            mutator: function(key, method) {
                this[key] = function(self) {
                    var args = arguments.length > 1 ? slice.call(arguments, 1) : [];
                    return method.apply(self, args);
                };
                this.prototype[key] = method;
            },
            constructor: {
                prototype: {}
            }
        });

        module.exports = function(proto) {
            var inherits = proto.inherits || (proto.inherits = shell);
            proto.constructor = prime.create(inherits);
            return prime(proto);
        };
    },
    "7": function(require, module, exports, global) {
        /*
Emitter
*/
                "use strict";

        var prime = require("1"), array = require("5");

        var EID = 0;

        module.exports = prime({
            on: function(event, fn) {
                var listeners = this._listeners || (this._listeners = {}), events = listeners[event] || (listeners[event] = {});
                var exists = false;
                for (var k in events) if (events[k] === fn) {
                    exists = true;
                    break;
                }
                if (!exists) events[(EID++).toString(36)] = fn;
                return this;
            },
            off: function(event, fn) {
                var listeners = this._listeners, events, key, k, l, empty, length = 0;
                if (listeners && (events = listeners[event])) {
                    for (k in events) {
                        length++;
                        if (key == null && events[k] === fn) key = k;
                        if (key && length > 1) break;
                    }
                    if (key) {
                        delete events[key];
                        if (length === 1) {
                            delete listeners[event];
                            empty = true;
                            for (l in listeners) {
                                empty = false;
                                break;
                            }
                            if (empty) delete this._listeners;
                        }
                    }
                }
                return this;
            },
            emit: function(event) {
                var listeners = this._listeners, events;
                if (listeners && (events = listeners[event])) {
                    var args = arguments.length > 1 ? array.slice(arguments, 1) : [];
                    for (var k in events) events[k].apply(this, args);
                }
                return this;
            }
        });
    },
    "8": function(require, module, exports, global) {
        /*
attributes
*/
                "use strict";

        var $ = require("4"), string = require("9"), array = require("5");

        // attributes
        $.implement({
            setAttribute: function(name, value) {
                this.forEach(function(node) {
                    node.setAttribute(name, value);
                });
                return this;
            },
            getAttribute: function(name) {
                var attr = this[0].getAttributeNode(name);
                return attr && attr.specified ? attr.value : null;
            },
            hasAttribute: function(name) {
                var node = this[0];
                if (node.hasAttribute) return node.hasAttribute(name);
                var attr = node.getAttributeNode(name);
                return !!(attr && attr.specified);
            },
            removeAttribute: function(name) {
                this.forEach(function(node) {
                    var attr = node.getAttributeNode(name);
                    if (attr) node.removeAttributeNode(attr);
                });
                return this;
            }
        });

        var accessors = {};

        array.forEach("type,value,name,href,title,id".split(","), function(name) {
            accessors[name] = function(value) {
                if (value !== undefined) {
                    this.forEach(function(node) {
                        node[name] = value;
                    });
                    return this;
                }
                return this[0][name];
            };
        });

        // booleans
        array.forEach("checked,disabled,selected".split(","), function(name) {
            accessors[name] = function(value) {
                if (value !== undefined) {
                    this.forEach(function(node) {
                        node[name] = !!value;
                    });
                    return this;
                }
                return !!this[0][name];
            };
        });

        // className
        var classes = function(className) {
            var classNames = string.clean(className).split(" "), uniques = {};
            return array.filter(classNames, function(className) {
                if (className !== "" && !uniques[className]) return uniques[className] = className;
            }).sort();
        };

        accessors.className = function(className) {
            if (className !== undefined) {
                this.forEach(function(node) {
                    node.className = classes(className).join(" ");
                });
                return this;
            }
            return classes(this[0].className).join(" ");
        };

        // attribute
        $.implement({
            attribute: function(name, value) {
                var accessor = accessors[name];
                if (accessor) return accessor.call(this, value);
                if (value != null) return this.setAttribute(name, value);
                if (value === null) return this.removeAttribute(name);
                if (value === undefined) return this.getAttribute(name);
            }
        });

        $.implement(accessors);

        // shortcuts
        $.implement({
            check: function() {
                return this.checked(true);
            },
            uncheck: function() {
                return this.checked(false);
            },
            disable: function() {
                return this.disabled(true);
            },
            enable: function() {
                return this.disabled(false);
            },
            select: function() {
                return this.selected(true);
            },
            deselect: function() {
                return this.selected(false);
            }
        });

        // classNames, has / add / remove Class
        $.implement({
            classNames: function() {
                return classes(this[0].className);
            },
            hasClass: function(className) {
                return array.indexOf(this.classNames(), className) > -1;
            },
            addClass: function(className) {
                this.forEach(function(node) {
                    var nodeClassName = node.className;
                    var classNames = classes(nodeClassName + " " + className).join(" ");
                    if (nodeClassName != classNames) node.className = classNames;
                });
                return this;
            },
            removeClass: function(className) {
                this.forEach(function(node) {
                    var classNames = classes(node.className);
                    array.forEach(classes(className), function(className) {
                        var index = array.indexOf(classNames, className);
                        if (index > -1) classNames.splice(index, 1);
                    });
                    node.className = classNames.join(" ");
                });
                return this;
            }
        });

        // toString
        $.prototype.toString = function() {
            var tag = this.tag(), id = this.id(), classes = this.classNames();
            var str = tag;
            if (id) str += "#" + id;
            if (classes.length) str += "." + classes.join(".");
            return str;
        };

        var textProperty = document.createElement("div").textContent == null ? "innerText" : "textContent";

        // tag, html, text
        $.implement({
            tag: function() {
                return this[0].tagName.toLowerCase();
            },
            html: function(html) {
                if (html != null) {
                    this.forEach(function(node) {
                        node.innerHTML = html;
                    });
                    return this;
                }
                return this[0].innerHTML;
            },
            text: function(text) {
                if (text != undefined) {
                    this.forEach(function(node) {
                        node[textProperty] = text;
                    });
                    return this;
                }
                return this[0][textProperty];
            }
        });

        module.exports = $;
    },
    "9": function(require, module, exports, global) {
        /*
string methods
 - inherits from es5/string
*/
                "use strict";

        var shell = require("6");

        var string = shell({
            inherits: require("a"),
            /*(string.clean)?*/
            clean: function() {
                return string.trim((this + "").replace(/\s+/g, " "));
            },
            /*:*/
            /*(string.camelize)?*/
            camelize: function() {
                return (this + "").replace(/-\D/g, function(match) {
                    return match.charAt(1).toUpperCase();
                });
            },
            /*:*/
            /*(string.hyphenate)?*/
            hyphenate: function() {
                return (this + "").replace(/[A-Z]/g, function(match) {
                    return "-" + match.toLowerCase();
                });
            },
            /*:*/
            /*(string.capitalize)?*/
            capitalize: function() {
                return (this + "").replace(/\b[a-z]/g, function(match) {
                    return match.toUpperCase();
                });
            },
            /*:*/
            /*(string.escape)?*/
            // « https://github.com/slevithan/XRegExp/blob/master/src/xregexp.js
            escape: function() {
                return (this + "").replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1");
            },
            /*:*/
            /*(string.number)?*/
            number: function() {
                return parseFloat(this);
            }
        });

        /*(string.decode)?*/
        if (typeof JSON !== "undefined") string.implement({
            decode: function() {
                return JSON.parse(this);
            }
        });

        /*:*/
        module.exports = string;
    },
    a: function(require, module, exports, global) {
        /*
string
 - es5 string shell
*/
                "use strict";

        var shell = require("6");

        var proto = String.prototype;

        var string = shell({
            trim: proto.trim || function() {
                return (this + "").replace(/^\s+|\s+$/g, "");
            }
        });

        var methods = {};

        var names = "charAt,charCodeAt,concat,indexOf,lastIndexOf,match,quote,replace,search,slice,split,substr,substring,toLowerCase,toUpperCase".split(",");

        for (var i = 0, name, method; name = names[i++]; ) if (method = proto[name]) methods[name] = method;

        string.implement(methods);

        module.exports = string;
    },
    b: function(require, module, exports, global) {
        /*
delegation
*/
                "use strict";

        var $ = require("3"), Map = require("c");

        require("d");

        $.implement({
            delegate: function(event, selector, handle) {
                this.forEach(function(node) {
                    var self = $(node);
                    var delegation = self._delegation || (self._delegation = {}), events = delegation[event] || (delegation[event] = {}), map = events[selector] || (events[selector] = new Map());
                    var action = function(e) {
                        var target = $(e.target), match = target.matches(selector) ? target : target.parent(selector);
                        if (match) handle.call(self, e, match);
                    };
                    map.set(handle, action);
                    self.on(event, action);
                });
                return this;
            },
            undelegate: function(event, selector, handle) {
                this.forEach(function(node) {
                    var self = $(node), delegation, events, map;
                    if (!(delegation = self._delegation) || !(events = delegation[event]) || !(map = events[selector])) return;
                    var action = map.get(handle);
                    if (action) {
                        self.off(event, action);
                        map.remove(handle);
                        // if there are no more handles in a given selector, delete it
                        if (!map.count()) delete events[selector];
                        // var evc = evd = 0, x
                        var e1 = true, e2 = true, x;
                        for (x in events) {
                            e1 = false;
                            break;
                        }
                        // if no more selectors in a given event type, delete it
                        if (e1) delete delegation[event];
                        for (x in delegation) {
                            e2 = false;
                            break;
                        }
                        // if there are no more delegation events in the element, delete the _delegation object
                        if (!e2) delete self._delegation;
                    }
                });
                return this;
            }
        });

        module.exports = $;
    },
    c: function(require, module, exports, global) {
        /*
map
 - must be instantiated
*/
                "use strict";

        var prime = require("1"), array = require("5"), proto = array.prototype;

        // set, get, count, each, map, filter, some, every, index, remove, keys, values
        var Map = prime({
            constructor: function() {
                if (!(this instanceof Map)) return new Map();
                this.length = 0;
                this._keys = [];
                this._values = [];
            },
            set: function(key, value) {
                var index = proto.indexOf.call(this._keys, key);
                if (index === -1) {
                    this._keys[this.length] = key;
                    this._values[this.length] = value;
                    this.length++;
                } else {
                    this._values[index] = value;
                }
                return this;
            },
            get: function(key) {
                var index = proto.indexOf.call(this._keys, key);
                return index === -1 ? null : this._values[index];
            },
            count: function() {
                return this.length;
            },
            each: function(method, context) {
                for (var i = 0, l = this.length; i < l; i++) {
                    if (method.call(context, this._values[i], this._keys[i], this) === false) break;
                }
                return this;
            },
            map: function(method, context) {
                var results = new Map();
                this.each(function(value, key) {
                    results.set(key, method.call(context, value, key, this));
                }, this);
                return results;
            },
            filter: function(method, context) {
                var results = new Map();
                this.each(function(value, key) {
                    if (method.call(context, value, key, this)) results.set(key, value);
                }, this);
                return results;
            },
            every: function(method, context) {
                var every = true;
                this.each(function(value, key) {
                    if (!method.call(context, value, key, this)) return every = false;
                }, this);
                return every;
            },
            some: function(method, context) {
                var some = false;
                this.each(function(value, key) {
                    if (method.call(context, value, key, this)) return !(some = true);
                }, this);
                return some;
            },
            index: function(value) {
                var index = proto.indexOf.call(this._values, value);
                return index > -1 ? this._keys[index] : null;
            },
            remove: function(key) {
                var index = proto.indexOf.call(this._keys, key);
                if (index !== -1) {
                    this._keys.splice(index, 1);
                    this.length--;
                    return this._values.splice(index, 1)[0];
                }
                return null;
            },
            keys: function() {
                return this._keys.slice();
            },
            values: function() {
                return this._values.slice();
            },
            toString: function() {
                return "[object Map]";
            }
        });

        module.exports = Map;
    },
    d: function(require, module, exports, global) {
        /*
traversal
*/
                "use strict";

        var $ = require("4"), array = require("5"), slick = require("e");

        var walk = function(combinator, method) {
            return function(expression) {
                var parts = slick.parse(expression || "*");
                expression = array.map(parts, function(part) {
                    return combinator + " " + part;
                }).join(", ");
                return this[method](expression);
            };
        };

        $.implement({
            search: function(expression) {
                if (this.length === 1) return $(slick.search(expression, this[0], new $()));
                var buffer = [];
                for (var i = 0, node; node = this[i]; i++) buffer.push.apply(buffer, slick.search(expression, node));
                return $(buffer).sort();
            },
            find: function(expression) {
                if (this.length === 1) return $(slick.find(expression, this[0]));
                var buffer = [];
                for (var i = 0, node; node = this[i]; i++) buffer.push(slick.find(expression, node));
                return $(buffer);
            },
            sort: function() {
                return slick.sort(this);
            },
            matches: function(expression) {
                return slick.matches(this[0], expression);
            },
            nextSiblings: walk("~", "search"),
            nextSibling: walk("+", "find"),
            previousSiblings: walk("!~", "search"),
            previousSibling: walk("!+", "find"),
            children: walk(">", "search"),
            firstChild: walk("^", "find"),
            lastChild: walk("!^", "find"),
            parent: function(expression) {
                for (var i = 0, node; node = this[i]; i++) while (node = node.parentNode) {
                    if (!expression || slick.matches(node, expression)) return $(node);
                }
                return null;
            },
            parents: function(expression) {
                var buffer = [];
                for (var i = 0, node; node = this[i]; i++) while (node = node.parentNode) {
                    if (!expression || slick.matches(node, expression)) buffer.push(node);
                }
                return $(buffer);
            }
        });

        module.exports = $;
    },
    e: function(require, module, exports, global) {
        /*
main
*/
                "use strict";

        var parse = require("f"), slick = require("g");

        slick.parse = parse;

        module.exports = slick;
    },
    f: function(require, module, exports, global) {
        /*
Slick Parser
 - originally created by the almighty Thomas Aylott <@subtlegradient> (http://subtlegradient.com)
*/
                "use strict";

        // Notable changes from Slick.Parser 1.0.x
        // The parser now uses 2 classes: Expressions and Expression
        // `new Expressions` produces an array-like object containing a list of Expression objects
        // - Expressions::toString() produces a cleaned up expressions string
        // `new Expression` produces an array-like object
        // - Expression::toString() produces a cleaned up expression string
        // The only exposed method is parse, which produces a (cached) `new Expressions` instance
        // parsed.raw is no longer present, use .toString()
        // parsed.expression is now useless, just use the indexes
        // parsed.reverse() has been removed for now, due to its apparent uselessness
        // Other changes in the Expressions object:
        // - classNames are now unique, and save both escaped and unescaped values
        // - attributes now save both escaped and unescaped values
        // - pseudos now save both escaped and unescaped values
        var escapeRe = /([-.*+?^${}()|[\]\/\\])/g, unescapeRe = /\\/g;

        var escape = function(string) {
            // XRegExp v2.0.0-beta-3
            // « https://github.com/slevithan/XRegExp/blob/master/src/xregexp.js
            return (string + "").replace(escapeRe, "\\$1");
        };

        var unescape = function(string) {
            return (string + "").replace(unescapeRe, "");
        };

        var slickRe = RegExp(/*
#!/usr/bin/env ruby
puts "\t\t" + DATA.read.gsub(/\(\?x\)|\s+#.*$|\s+|\\$|\\n/,'')
__END__
    "(?x)^(?:\
      \\s* ( , ) \\s*               # Separator          \n\
    | \\s* ( <combinator>+ ) \\s*   # Combinator         \n\
    |      ( \\s+ )                 # CombinatorChildren \n\
    |      ( <unicode>+ | \\* )     # Tag                \n\
    | \\#  ( <unicode>+       )     # ID                 \n\
    | \\.  ( <unicode>+       )     # ClassName          \n\
    |                               # Attribute          \n\
    \\[  \
        \\s* (<unicode1>+)  (?:  \
            \\s* ([*^$!~|]?=)  (?:  \
                \\s* (?:\
                    ([\"']?)(.*?)\\9 \
                )\
            )  \
        )?  \\s*  \
    \\](?!\\]) \n\
    |   :+ ( <unicode>+ )(?:\
    \\( (?:\
        (?:([\"'])([^\\12]*)\\12)|((?:\\([^)]+\\)|[^()]*)+)\
    ) \\)\
    )?\
    )"
*/
        "^(?:\\s*(,)\\s*|\\s*(<combinator>+)\\s*|(\\s+)|(<unicode>+|\\*)|\\#(<unicode>+)|\\.(<unicode>+)|\\[\\s*(<unicode1>+)(?:\\s*([*^$!~|]?=)(?:\\s*(?:([\"']?)(.*?)\\9)))?\\s*\\](?!\\])|(:+)(<unicode>+)(?:\\((?:(?:([\"'])([^\\13]*)\\13)|((?:\\([^)]+\\)|[^()]*)+))\\))?)".replace(/<combinator>/, "[" + escape(">+~`!@$%^&={}\\;</") + "]").replace(/<unicode>/g, "(?:[\\w\\u00a1-\\uFFFF-]|\\\\[^\\s0-9a-f])").replace(/<unicode1>/g, "(?:[:\\w\\u00a1-\\uFFFF-]|\\\\[^\\s0-9a-f])"));

        // Part
        var Part = function Part(combinator) {
            this.combinator = combinator || " ";
            this.tag = "*";
        };

        Part.prototype.toString = function() {
            if (!this.raw) {
                var xpr = "", k, part;
                xpr += this.tag || "*";
                if (this.id) xpr += "#" + this.id;
                if (this.classes) xpr += "." + this.classList.join(".");
                if (this.attributes) for (k = 0; part = this.attributes[k++]; ) {
                    xpr += "[" + part.name + (part.operator ? part.operator + '"' + part.value + '"' : "") + "]";
                }
                if (this.pseudos) for (k = 0; part = this.pseudos[k++]; ) {
                    xpr += ":" + part.name;
                    if (part.value) xpr += "(" + part.value + ")";
                }
                this.raw = xpr;
            }
            return this.raw;
        };

        // Expression
        var Expression = function Expression() {
            this.length = 0;
        };

        Expression.prototype.toString = function() {
            if (!this.raw) {
                var xpr = "";
                for (var j = 0, bit; bit = this[j++]; ) {
                    if (j !== 1) xpr += " ";
                    if (bit.combinator !== " ") xpr += bit.combinator + " ";
                    xpr += bit;
                }
                this.raw = xpr;
            }
            return this.raw;
        };

        var replacer = function(rawMatch, separator, combinator, combinatorChildren, tagName, id, className, attributeKey, attributeOperator, attributeQuote, attributeValue, pseudoMarker, pseudoClass, pseudoQuote, pseudoClassQuotedValue, pseudoClassValue) {
            var expression, current;
            if (separator || !this.length) {
                expression = this[this.length++] = new Expression();
                if (separator) return "";
            }
            if (!expression) expression = this[this.length - 1];
            if (combinator || combinatorChildren || !expression.length) {
                current = expression[expression.length++] = new Part(combinator);
            }
            if (!current) current = expression[expression.length - 1];
            if (tagName) {
                current.tag = unescape(tagName);
            } else if (id) {
                current.id = unescape(id);
            } else if (className) {
                var unescaped = unescape(className);
                var classes = current.classes || (current.classes = {});
                if (!classes[unescaped]) {
                    classes[unescaped] = escape(className);
                    var classList = current.classList || (current.classList = []);
                    classList.push(unescaped);
                    classList.sort();
                }
            } else if (pseudoClass) {
                pseudoClassValue = pseudoClassValue || pseudoClassQuotedValue;
                (current.pseudos || (current.pseudos = [])).push({
                    type: pseudoMarker.length == 1 ? "class" : "element",
                    name: unescape(pseudoClass),
                    escapedName: escape(pseudoClass),
                    value: pseudoClassValue ? unescape(pseudoClassValue) : null,
                    escapedValue: pseudoClassValue ? escape(pseudoClassValue) : null
                });
            } else if (attributeKey) {
                attributeValue = attributeValue ? escape(attributeValue) : null;
                (current.attributes || (current.attributes = [])).push({
                    operator: attributeOperator,
                    name: unescape(attributeKey),
                    escapedName: escape(attributeKey),
                    value: attributeValue ? unescape(attributeValue) : null,
                    escapedValue: attributeValue ? escape(attributeValue) : null
                });
            }
            return "";
        };

        // Expressions
        var Expressions = function Expressions(expression) {
            this.length = 0;
            var self = this;
            while (expression) expression = expression.replace(slickRe, function() {
                return replacer.apply(self, arguments);
            });
        };

        Expressions.prototype.toString = function() {
            if (!this.raw) {
                var expressions = [];
                for (var i = 0, expression; expression = this[i++]; ) expressions.push(expression);
                this.raw = expressions.join(", ");
            }
            return this.raw;
        };

        var cache = {};

        var parse = function(expression) {
            if (expression == null) return null;
            expression = ("" + expression).replace(/^\s+|\s+$/g, "");
            return cache[expression] || (cache[expression] = new Expressions(expression));
        };

        module.exports = parse;
    },
    g: function(require, module, exports, global) {
        /*
Finder Finder
*/
                "use strict";

        // Notable changes from Slick.Finder 1.0.x
        // faster bottom -> up expression matching
        // prefers mental sanity over *obsessive compulsive* milliseconds savings
        // uses prototypes instead of objects
        // tries to use matchesSelector smartly, whenever available
        // can populate objects as well as arrays
        // lots of stuff is broken or not implemented
        var parse = require("f");

        // utilities
        var uniqueIndex = 0;

        var uniqueID = function(node) {
            return node.uniqueNumber || (node.uniqueNumber = "s:" + uniqueIndex++);
        };

        var uniqueIDXML = function(node) {
            var uid = node.getAttribute("uniqueNumber");
            if (!uid) {
                uid = "s:" + uniqueIndex++;
                node.setAttribute("uniqueNumber", uid);
            }
            return uid;
        };

        var isArray = Array.isArray || function(object) {
            return Object.prototype.toString.call(object) === "[object Array]";
        };

        // tests
        var HAS = {
            GET_ELEMENT_BY_ID: function(test, id) {
                // checks if the document has getElementById, and it works
                test.innerHTML = '<a id="' + id + '"></a>';
                return !!this.getElementById(id);
            },
            QUERY_SELECTOR: function(test) {
                // this supposedly fixes a webkit bug with matchesSelector / querySelector & nth-child
                test.innerHTML = "_<style>:nth-child(2){}</style>";
                // checks if the document has querySelectorAll, and it works
                test.innerHTML = '<a class="MiX"></a>';
                return test.querySelectorAll(".MiX").length === 1;
            },
            EXPANDOS: function(test, id) {
                // checks if the document has elements that support expandos
                test._custom_property_ = id;
                return test._custom_property_ === id;
            },
            // TODO: use this ?
            // CHECKED_QUERY_SELECTOR: function(test){
            //
            //     // checks if the document supports the checked query selector
            //     test.innerHTML = '<select><option selected="selected">a</option></select>'
            //     return test.querySelectorAll(':checked').length === 1
            // },
            // TODO: use this ?
            // EMPTY_ATTRIBUTE_QUERY_SELECTOR: function(test){
            //
            //     // checks if the document supports the empty attribute query selector
            //     test.innerHTML = '<a class=""></a>'
            //     return test.querySelectorAll('[class*=""]').length === 1
            // },
            MATCHES_SELECTOR: function(test) {
                test.innerHTML = '<a class="MiX"></a>';
                // checks if the document has matchesSelector, and we can use it.
                var matches = test.matchesSelector || test.mozMatchesSelector || test.webkitMatchesSelector;
                // if matchesSelector trows errors on incorrect syntax we can use it
                if (matches) try {
                    matches.call(test, ":slick");
                } catch (e) {
                    // just as a safety precaution, also test if it works on mixedcase (like querySelectorAll)
                    return matches.call(test, ".MiX") ? matches : false;
                }
                return false;
            },
            GET_ELEMENTS_BY_CLASS_NAME: function(test) {
                test.innerHTML = '<a class="f"></a><a class="b"></a>';
                if (test.getElementsByClassName("b").length !== 1) return false;
                test.firstChild.className = "b";
                if (test.getElementsByClassName("b").length !== 2) return false;
                // Opera 9.6 getElementsByClassName doesnt detects the class if its not the first one
                test.innerHTML = '<a class="a"></a><a class="f b a"></a>';
                if (test.getElementsByClassName("a").length !== 2) return false;
                // tests passed
                return true;
            },
            // no need to know
            // GET_ELEMENT_BY_ID_NOT_NAME: function(test, id){
            //     test.innerHTML = '<a name="'+ id +'"></a><b id="'+ id +'"></b>'
            //     return this.getElementById(id) !== test.firstChild
            // },
            // this is always checked for and fixed
            // STAR_GET_ELEMENTS_BY_TAG_NAME: function(test){
            //
            //     // IE returns comment nodes for getElementsByTagName('*') for some documents
            //     test.appendChild(this.createComment(''))
            //     if (test.getElementsByTagName('*').length > 0) return false
            //
            //     // IE returns closed nodes (EG:"</foo>") for getElementsByTagName('*') for some documents
            //     test.innerHTML = 'foo</foo>'
            //     if (test.getElementsByTagName('*').length) return false
            //
            //     // tests passed
            //     return true
            // },
            // this is always checked for and fixed
            // STAR_QUERY_SELECTOR: function(test){
            //
            //     // returns closed nodes (EG:"</foo>") for querySelector('*') for some documents
            //     test.innerHTML = 'foo</foo>'
            //     return !!(test.querySelectorAll('*').length)
            // },
            GET_ATTRIBUTE: function(test) {
                // tests for working getAttribute implementation
                var shout = "fus ro dah";
                test.innerHTML = '<a class="' + shout + '"></a>';
                return test.firstChild.getAttribute("class") === shout;
            }
        };

        // Finder
        var Finder = function Finder(document) {
            this.document = document;
            var root = this.root = document.documentElement;
            this.tested = {};
            // uniqueID
            this.uniqueID = this.has("EXPANDOS") ? uniqueID : uniqueIDXML;
            // getAttribute
            this.getAttribute = this.has("GET_ATTRIBUTE") ? function(node, name) {
                return node.getAttribute(name);
            } : function(node, name) {
                var node = node.getAttributeNode(name);
                return node && node.specified ? node.value : null;
            };
            // hasAttribute
            this.hasAttribute = root.hasAttribute ? function(node, attribute) {
                return node.hasAttribute(attribute);
            } : function(node, attribute) {
                node = node.getAttributeNode(attribute);
                return !!(node && node.specified);
            };
            // contains
            this.contains = document.contains && root.contains ? function(context, node) {
                return context.contains(node);
            } : root.compareDocumentPosition ? function(context, node) {
                return context === node || !!(context.compareDocumentPosition(node) & 16);
            } : function(context, node) {
                do {
                    if (node === context) return true;
                } while (node = node.parentNode);
                return false;
            };
            // sort
            // credits to Sizzle (http://sizzlejs.com/)
            this.sorter = root.compareDocumentPosition ? function(a, b) {
                if (!a.compareDocumentPosition || !b.compareDocumentPosition) return 0;
                return a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
            } : "sourceIndex" in root ? function(a, b) {
                if (!a.sourceIndex || !b.sourceIndex) return 0;
                return a.sourceIndex - b.sourceIndex;
            } : document.createRange ? function(a, b) {
                if (!a.ownerDocument || !b.ownerDocument) return 0;
                var aRange = a.ownerDocument.createRange(), bRange = b.ownerDocument.createRange();
                aRange.setStart(a, 0);
                aRange.setEnd(a, 0);
                bRange.setStart(b, 0);
                bRange.setEnd(b, 0);
                return aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
            } : null;
            this.failed = {};
            var nativeMatches = this.has("MATCHES_SELECTOR");
            if (nativeMatches) this.matchesSelector = function(node, expression) {
                if (this.failed[expression]) return true;
                try {
                    return nativeMatches.call(node, expression);
                } catch (e) {
                    if (slick.debug) console.warn("matchesSelector failed on " + expression);
                    return this.failed[expression] = true;
                }
            };
            if (this.has("QUERY_SELECTOR")) {
                this.querySelectorAll = function(node, expression) {
                    if (this.failed[expression]) return true;
                    var result, _id, _expression, _slick_id, _combinator;
                    // non-document rooted QSA
                    // credits to Andrew Dupont
                    if (node !== this.document) {
                        _combinator = expression[0].combinator;
                        _id = node.getAttribute("id");
                        _expression = expression;
                        if (!_id) {
                            _slick_id = true;
                            _id = "__slick__";
                            node.setAttribute("id", _id);
                        }
                        expression = "#" + _id + " " + _expression;
                        // these combinators need a parentNode due to how querySelectorAll works, which is:
                        // finding all the elements that match the given selector
                        // then filtering by the ones that have the specified element as an ancestor
                        if (_combinator.indexOf("~") > -1 || _combinator.indexOf("+") > -1) {
                            node = node.parentNode;
                            if (!node) result = true;
                        }
                    }
                    if (!result) try {
                        result = node.querySelectorAll(expression);
                    } catch (e) {
                        if (slick.debug) console.warn("querySelectorAll failed on " + (_expression || expression));
                        result = this.failed[_expression || expression] = true;
                    }
                    if (_slick_id) node.removeAttribute("id");
                    return result;
                };
            }
        };

        Finder.prototype.has = function(FEATURE) {
            var tested = this.tested, testedFEATURE = tested[FEATURE];
            if (testedFEATURE != null) return testedFEATURE;
            var root = this.root, document = this.document, testNode = document.createElement("div");
            testNode.setAttribute("style", "display: none;");
            root.appendChild(testNode);
            var TEST = HAS[FEATURE], result = false;
            if (TEST) try {
                result = TEST.call(document, testNode, "s:" + uniqueIndex++);
            } catch (e) {}
            if (slick.debug && !result) console.warn("document has no " + FEATURE);
            root.removeChild(testNode);
            return tested[FEATURE] = result;
        };

        var combinators = {
            " ": function(node, part, push) {
                var item, items;
                var noId = !part.id, noTag = !part.tag, noClass = !part.classes;
                if (part.id && node.getElementById && this.has("GET_ELEMENT_BY_ID")) {
                    item = node.getElementById(part.id);
                    // return only if id is found, else keep checking
                    // might be a tad slower on non-existing ids, but less insane
                    if (item && item.getAttribute("id") === part.id) {
                        items = [ item ];
                        noId = true;
                        // if tag is star, no need to check it in match()
                        if (part.tag === "*") noTag = true;
                    }
                }
                if (!items) {
                    if (part.classes && node.getElementsByClassName && this.has("GET_ELEMENTS_BY_CLASS_NAME")) {
                        items = node.getElementsByClassName(part.classList);
                        noClass = true;
                        // if tag is star, no need to check it in match()
                        if (part.tag === "*") noTag = true;
                    } else {
                        items = node.getElementsByTagName(part.tag);
                        // if tag is star, need to check it in match because it could select junk, boho
                        if (part.tag !== "*") noTag = true;
                    }
                    if (!items || !items.length) return false;
                }
                for (var i = 0; item = items[i++]; ) if (noTag && noId && noClass && !part.attributes && !part.pseudos || this.match(item, part, noTag, noId, noClass)) push(item);
                return true;
            },
            ">": function(node, part, push) {
                // direct children
                if (node = node.firstChild) do {
                    if (node.nodeType == 1 && this.match(node, part)) push(node);
                } while (node = node.nextSibling);
            },
            "+": function(node, part, push) {
                // next sibling
                while (node = node.nextSibling) if (node.nodeType == 1) {
                    if (this.match(node, part)) push(node);
                    break;
                }
            },
            "^": function(node, part, push) {
                // first child
                node = node.firstChild;
                if (node) {
                    if (node.nodeType === 1) {
                        if (this.match(node, part)) push(node);
                    } else {
                        combinators["+"].call(this, node, part, push);
                    }
                }
            },
            "~": function(node, part, push) {
                // next siblings
                while (node = node.nextSibling) {
                    if (node.nodeType === 1 && this.match(node, part)) push(node);
                }
            },
            "++": function(node, part, push) {
                // next sibling and previous sibling
                combinators["+"].call(this, node, part, push);
                combinators["!+"].call(this, node, part, push);
            },
            "~~": function(node, part, push) {
                // next siblings and previous siblings
                combinators["~"].call(this, node, part, push);
                combinators["!~"].call(this, node, part, push);
            },
            "!": function(node, part, push) {
                // all parent nodes up to document
                while (node = node.parentNode) if (node !== this.document && this.match(node, part)) push(node);
            },
            "!>": function(node, part, push) {
                // direct parent (one level)
                node = node.parentNode;
                if (node !== this.document && this.match(node, part)) push(node);
            },
            "!+": function(node, part, push) {
                // previous sibling
                while (node = node.previousSibling) if (node.nodeType == 1) {
                    if (this.match(node, part)) push(node);
                    break;
                }
            },
            "!^": function(node, part, push) {
                // last child
                node = node.lastChild;
                if (node) {
                    if (node.nodeType == 1) {
                        if (this.match(node, part)) push(node);
                    } else {
                        combinators["+"].call(this, node, part);
                    }
                }
            },
            "!~": function(node, part, push) {
                // previous siblings
                while (node = node.previousSibling) {
                    if (node.nodeType === 1 && this.match(node, part)) push(node);
                }
            }
        };

        Finder.prototype.search = function(context, expression, found) {
            if (!context) context = this.document; else if (context.document) context = context.document;
            var expressions = parse(expression);
            if (!expressions || !expressions.length) throw new Error("invalid expression");
            if (!found) found = [];
            var uniques, push = isArray(found) ? function(node) {
                found[found.length] = node;
            } : function(node) {
                found[found.length++] = node;
            };
            if (expressions.length > 1) {
                uniques = {};
                var plush = push;
                push = function(node) {
                    var uid = uniqueID(node);
                    if (!uniques[uid]) {
                        uniques[uid] = true;
                        plush(node);
                    }
                };
            }
            // walker
            var node, nodes, part, ctx;
            main: for (var i = 0; expression = expressions[i++]; ) {
                // querySelector
                // TODO: more functional tests
                if (!slick.noQSA && this.querySelectorAll) {
                    nodes = this.querySelectorAll(context, expression);
                    if (nodes !== true) {
                        if (nodes && nodes.length) for (var j = 0; node = nodes[j++]; ) if (node.nodeName > "@") {
                            push(node);
                        }
                        continue main;
                    }
                }
                if (expression.length === 1) {
                    part = expression[0];
                    combinators[part.combinator].call(this, context, part, push);
                } else {
                    var cs = [ context ], c, f, u, p = function(node) {
                        var uid = uniqueID(node);
                        if (!u[uid]) {
                            u[uid] = true;
                            f[f.length] = node;
                        }
                    };
                    for (var j = 0; part = expression[j++]; ) {
                        f = [];
                        u = {};
                        for (var k = 0; c = cs[k++]; ) combinators[part.combinator].call(this, c, part, p);
                        if (!f.length) continue main;
                        if (j === expression.length) found = f; else cs = f;
                    }
                }
                if (!found.length) continue main;
            }
            if (uniques && found && found.length > 1) this.sort(found);
            return found;
        };

        Finder.prototype.sort = function(nodes) {
            return this.sorter ? Array.prototype.sort.call(nodes, this.sorter) : nodes;
        };

        // TODO: most of these pseudo selectors include <html> and qsa doesnt. fixme.
        var pseudos = {
            // TODO: returns different results than qsa empty.
            empty: function() {
                var child = this.firstChild;
                return !(this && this.nodeType === 1) && !(this.innerText || this.textContent || "").length;
            },
            not: function(expression) {
                return !slick.match(this, expression);
            },
            contains: function(text) {
                return (this.innerText || this.textContent || "").indexOf(text) > -1;
            },
            "first-child": function() {
                var node = this;
                while (node = node.previousSibling) if (node.nodeType == 1) return false;
                return true;
            },
            "last-child": function() {
                var node = this;
                while (node = node.nextSibling) if (node.nodeType == 1) return false;
                return true;
            },
            "only-child": function() {
                var prev = this;
                while (prev = prev.previousSibling) if (prev.nodeType == 1) return false;
                var next = this;
                while (next = next.nextSibling) if (next.nodeType == 1) return false;
                return true;
            },
            "first-of-type": function() {
                var node = this, nodeName = node.nodeName;
                while (node = node.previousSibling) if (node.nodeName == nodeName) return false;
                return true;
            },
            "last-of-type": function() {
                var node = this, nodeName = node.nodeName;
                while (node = node.nextSibling) if (node.nodeName == nodeName) return false;
                return true;
            },
            "only-of-type": function() {
                var prev = this, nodeName = this.nodeName;
                while (prev = prev.previousSibling) if (prev.nodeName == nodeName) return false;
                var next = this;
                while (next = next.nextSibling) if (next.nodeName == nodeName) return false;
                return true;
            },
            enabled: function() {
                return !this.disabled;
            },
            disabled: function() {
                return this.disabled;
            },
            checked: function() {
                return this.checked || this.selected;
            },
            selected: function() {
                return this.selected;
            },
            focus: function() {
                var doc = this.ownerDocument;
                return doc.activeElement === this && (this.href || this.type || slick.hasAttribute(this, "tabindex"));
            },
            root: function() {
                return this === this.ownerDocument.documentElement;
            }
        };

        Finder.prototype.match = function(node, bit, noTag, noId, noClass) {
            // TODO: more functional tests ?
            if (!slick.noQSA && this.matchesSelector) {
                var matches = this.matchesSelector(node, bit);
                if (matches !== true) return matches;
            }
            // normal matching
            if (!noTag && bit.tag) {
                var nodeName = node.nodeName.toLowerCase();
                if (bit.tag === "*") {
                    if (nodeName < "@") return false;
                } else if (nodeName != bit.tag) {
                    return false;
                }
            }
            if (!noId && bit.id && node.getAttribute("id") !== bit.id) return false;
            var i, part;
            if (!noClass && bit.classes) {
                var className = this.getAttribute(node, "class");
                if (!className) return false;
                for (part in bit.classes) if (!RegExp("(^|\\s)" + bit.classes[part] + "(\\s|$)").test(className)) return false;
            }
            var name, value;
            if (bit.attributes) for (i = 0; part = bit.attributes[i++]; ) {
                var operator = part.operator, escaped = part.escapedValue;
                name = part.name;
                value = part.value;
                if (!operator) {
                    if (!this.hasAttribute(node, name)) return false;
                } else {
                    var actual = this.getAttribute(node, name);
                    if (actual == null) return false;
                    switch (operator) {
                      case "^=":
                        if (!RegExp("^" + escaped).test(actual)) return false;
                        break;

                      case "$=":
                        if (!RegExp(escaped + "$").test(actual)) return false;
                        break;

                      case "~=":
                        if (!RegExp("(^|\\s)" + escaped + "(\\s|$)").test(actual)) return false;
                        break;

                      case "|=":
                        if (!RegExp("^" + escaped + "(-|$)").test(actual)) return false;
                        break;

                      case "=":
                        if (actual !== value) return false;
                        break;

                      case "*=":
                        if (actual.indexOf(value) === -1) return false;
                        break;

                      default:
                        return false;
                    }
                }
            }
            if (bit.pseudos) for (i = 0; part = bit.pseudos[i++]; ) {
                name = part.name;
                value = part.value;
                if (pseudos[name]) return pseudos[name].call(node, value);
                if (value != null) {
                    if (this.getAttribute(node, name) !== value) return false;
                } else {
                    if (!this.hasAttribute(node, name)) return false;
                }
            }
            return true;
        };

        Finder.prototype.matches = function(node, expression) {
            var expressions = parse(expression);
            if (expressions.length === 1 && expressions[0].length === 1) {
                // simplest match
                return this.match(node, expressions[0][0]);
            }
            // TODO: more functional tests ?
            if (!slick.noQSA && this.matchesSelector) {
                var matches = this.matchesSelector(node, expressions);
                if (matches !== true) return matches;
            }
            var nodes = this.search(node, expression, {
                length: 0
            });
            for (var i = 0, res; res = nodes[i++]; ) if (node === res) return true;
            return false;
        };

        var finders = {};

        var finder = function(context) {
            var doc = context || document;
            if (doc.document) doc = doc.document; else if (doc.ownerDocument) doc = doc.ownerDocument;
            if (doc.nodeType !== 9) throw new TypeError("invalid document");
            var uid = uniqueID(doc);
            return finders[uid] || (finders[uid] = new Finder(doc));
        };

        // ... API ...
        var slick = function(expression, context) {
            return slick.search(expression, context);
        };

        slick.search = function(expression, context, found) {
            return finder(context).search(context, expression, found);
        };

        slick.find = function(expression, context) {
            return finder(context).search(context, expression)[0] || null;
        };

        slick.getAttribute = function(node, name) {
            return finder(node).getAttribute(node, name);
        };

        slick.hasAttribute = function(node, name) {
            return finder(node).hasAttribute(node, name);
        };

        slick.contains = function(context, node) {
            return finder(context).contains(context, node);
        };

        slick.matches = function(node, expression) {
            return finder(node).matches(node, expression);
        };

        slick.sort = function(nodes) {
            if (nodes && nodes.length > 1) finder(nodes[0]).sort(nodes);
            return nodes;
        };

        // slick.debug = true
        // slick.noQSA  = true
        module.exports = slick;
    },
    h: function(require, module, exports, global) {
        /*
insertion
*/
                "use strict";

        var $ = require("4");

        // base insertion
        $.implement({
            appendChild: function(child) {
                this[0].appendChild($(child)[0]);
                return this;
            },
            insertBefore: function(child, ref) {
                this[0].insertBefore($(child)[0], $(ref)[0]);
                return this;
            },
            removeChild: function(child) {
                this[0].removeChild($(child)[0]);
                return this;
            },
            replaceChild: function(child, ref) {
                this[0].replaceChild($(child)[0], $(ref)[0]);
                return this;
            }
        });

        // before, after, bottom, top
        $.implement({
            before: function(element) {
                element = $(element)[0];
                var parent = element.parentNode;
                if (parent) this.forEach(function(node) {
                    parent.insertBefore(node, element);
                });
                return this;
            },
            after: function(element) {
                element = $(element)[0];
                var parent = element.parentNode;
                if (parent) this.forEach(function(node) {
                    parent.insertBefore(node, element.nextSibling);
                });
                return this;
            },
            bottom: function(element) {
                element = $(element)[0];
                this.forEach(function(node) {
                    element.appendChild(node);
                });
                return this;
            },
            top: function(element) {
                element = $(element)[0];
                this.forEach(function(node) {
                    element.insertBefore(node, element.firstChild);
                });
                return this;
            }
        });

        // insert, replace
        $.implement({
            insert: $.prototype.bottom,
            remove: function() {
                this.forEach(function(node) {
                    var parent = node.parentNode;
                    if (parent) parent.removeChild(node);
                });
                return this;
            },
            replace: function(element) {
                element = $(element)[0];
                element.parentNode.replaceChild(this[0], element);
                return this;
            }
        });

        module.exports = $;
    },
    i: function(require, module, exports, global) {
                "use strict";

        var $ = require("j");

        $.implement({
            empty: function() {
                this.handle(function(node) {
                    var first;
                    while (first = node.firstChild) node.removeChild(first);
                });
                return this;
            }
        });

        module.exports = $;
    },
    j: function(require, module, exports, global) {
        /*
require everything and export
*/
                "use strict";

        var $ = require("k");

        require("m");

        require("s");

        require("t");

        require("n");

        module.exports = $;
    },
    k: function(require, module, exports, global) {
        /*
elements
*/
                "use strict";

        var prime = require("l");

        // uniqueID
        var uniqueIndex = 0;

        var uniqueID = function(n) {
            return n === global ? "global" : n.uniqueNumber || (n.uniqueNumber = "n:" + (uniqueIndex++).toString(36));
        };

        var instances = {};

        // `search` is the selector engine
        // `sort` is the elements sorter
        var search, sort;

        // the exposed prime
        var $ = prime({
            constructor: function $(n, context) {
                if (n == null) return null;
                if (n instanceof elements) return n;
                var self = new elements(), uid;
                if (n.nodeType || n === global) {
                    self[self.length++] = n;
                } else if (typeof n === "string") {
                    if (search) search(n, context, self);
                } else if (n.length) {
                    // this could be an array, or any object with a length attribute,
                    // including another instance of elements from another interface.
                    var uniques = {};
                    for (var i = 0, l = n.length; i < l; i++) {
                        // perform elements flattening
                        var nodes = $(n[i], context);
                        if (nodes && nodes.length) for (var j = 0, k = nodes.length; j < k; j++) {
                            var node = nodes[j];
                            uid = uniqueID(node);
                            if (!uniques[uid]) {
                                self[self.length++] = node;
                                uniques[uid] = true;
                            }
                        }
                    }
                    if (sort && self.length > 1) sort(self);
                }
                if (!self.length) return null;
                // when length is 1 always use the same elements instance
                if (self.length === 1) {
                    uid = uniqueID(self[0]);
                    return instances[uid] || (instances[uid] = self);
                }
                return self;
            }
        });

        // the resulting prime
        // this also makes it impossible to override handle (short of constructor hijacking)
        var elements = prime({
            inherits: $,
            constructor: function elements() {
                this.length = 0;
            },
            handle: function handle(method) {
                var buffer = [], length = this.length, res;
                if (length === 1) {
                    res = method.call(this, this[0], 0, buffer);
                    if (res != null && res !== false && res !== true) buffer.push(res);
                } else for (var i = 0; i < length; i++) {
                    var node = this[i];
                    res = method.call($(node), node, i, buffer);
                    if (res === false || res === true) break;
                    if (res != null) buffer.push(res);
                }
                return buffer;
            },
            remove: function(destroy) {
                var res = this.handle(function(node) {
                    var parent = node.parentNode;
                    if (parent) parent.removeChild(node);
                    if (destroy) {
                        delete instances[uniqueID(node)];
                        return node;
                    }
                });
                return destroy ? res : this;
            }
        });

        $.use = function(extension) {
            $.implement(prime.create(extension.prototype));
            if (extension.search) search = extension.search;
            if (extension.sort) sort = extension.sort;
            return this;
        };

        module.exports = $;
    },
    l: function(require, module, exports, global) {
        /*
prime
 - prototypal inheritance
*/
                "use strict";

        var has = function(self, key) {
            return Object.hasOwnProperty.call(self, key);
        };

        var each = function(object, method, context) {
            for (var key in object) if (method.call(context, object[key], key, object) === false) break;
            return object;
        };

        /*(es5 && fixEnumBug)?*/
        if (!{
            valueOf: 0
        }.propertyIsEnumerable("valueOf")) {
            // fix stupid IE enum 🐛
            var buggy = "constructor,toString,valueOf,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString".split(","), proto = Object.prototype;
            each = function(object, method, context) {
                var i = buggy.length, key, value;
                for (key in object) if (method.call(context, object[key], key, object) === false) return object;
                while (i--) {
                    key = buggy[i];
                    value = object[key];
                    if (value !== proto[key] && method.call(context, value, key, object) === false) break;
                }
                return object;
            };
        }

        /*:*/
        var create = Object.create || function(self) {
            var F = function() {};
            F.prototype = self;
            return new F();
        };

        /*:*/
        var mutator = function(key, value) {
            this.prototype[key] = value;
        };

        var implement = function(obj) {
            each(obj, function(value, key) {
                if (key !== "constructor" && key !== "inherits" && key !== "mutator") this.mutator(key, value);
            }, this);
            return this;
        };

        var prime = function(proto) {
            var superprime = proto.inherits, superproto;
            if (superprime) superproto = superprime.prototype;
            // if our nice proto object has no own constructor property
            // then we proceed using a ghosting constructor that all it does is
            // call the parent's constructor if it has a superprime, else an empty constructor
            // proto.constructor becomes the effective constructor
            var constructor = has(proto, "constructor") ? proto.constructor : superprime ? function() {
                return superproto.constructor.apply(this, arguments);
            } : function() {};
            if (superprime) {
                // inherit from superprime
                var cproto = constructor.prototype = create(superproto);
                // setting constructor.parent to superprime.prototype
                // because it's the shortest possible absolute reference
                constructor.parent = superproto;
                cproto.constructor = constructor;
            }
            // inherit (kindof inherit) mutator
            constructor.mutator = proto.mutator || superprime && superprime.mutator || mutator;
            // copy implement (this should never change)
            constructor.implement = implement;
            // finally implement proto and return constructor
            return constructor.implement(proto);
        };

        prime.each = each;

        prime.has = has;

        prime.create = create;

        module.exports = prime;
    },
    m: function(require, module, exports, global) {
        /*
elements attributes
*/
                "use strict";

        var $ = require("n"), string = require("q"), array = require("o");

        // attributes
        $.implement({
            setAttribute: function(name, value) {
                this.forEach(function(node) {
                    node.setAttribute(name, value);
                });
                return this;
            },
            getAttribute: function(name) {
                var attr = this[0].getAttributeNode(name);
                return attr && attr.specified ? attr.value : null;
            },
            hasAttribute: function(name) {
                var node = this[0];
                if (node.hasAttribute) return node.hasAttribute(name);
                var attr = node.getAttributeNode(name);
                return !!(attr && attr.specified);
            },
            removeAttribute: function(name) {
                this.forEach(function(node) {
                    var attr = node.getAttributeNode(name);
                    if (attr) node.removeAttributeNode(attr);
                });
                return this;
            }
        });

        var accessors = {};

        array.forEach("type,value,name,href,title,id".split(","), function(name) {
            accessors[name] = function(value) {
                if (value !== undefined) {
                    this.forEach(function(node) {
                        node[name] = value;
                    });
                    return this;
                }
                return this[0][name];
            };
        });

        // booleans
        array.forEach("checked,disabled,selected".split(","), function(name) {
            accessors[name] = function(value) {
                if (value !== undefined) {
                    this.forEach(function(node) {
                        node[name] = !!value;
                    });
                    return this;
                }
                return !!this[0][name];
            };
        });

        // className
        var classes = function(className) {
            var classNames = string.clean(className).split(" "), uniques = {};
            return array.filter(classNames, function(className) {
                if (className !== "" && !uniques[className]) return uniques[className] = className;
            }).sort();
        };

        accessors.className = function(className) {
            if (className !== undefined) {
                this.forEach(function(node) {
                    node.className = classes(className).join(" ");
                });
                return this;
            }
            return classes(this[0].className).join(" ");
        };

        // attribute
        $.implement({
            attribute: function(name, value) {
                var accessor = accessors[name];
                if (accessor) return accessor.call(this, value);
                if (value != null) return this.setAttribute(name, value); else if (value === null) return this.removeAttribute(name); else if (value === undefined) return this.getAttribute(name);
            }
        });

        $.implement(accessors);

        // shortcuts
        $.implement({
            check: function() {
                return this.checked(true);
            },
            uncheck: function() {
                return this.checked(false);
            },
            disable: function() {
                return this.disabled(true);
            },
            enable: function() {
                return this.disabled(false);
            },
            select: function() {
                return this.selected(true);
            },
            deselect: function() {
                return this.selected(false);
            }
        });

        // classNames, has / add / remove Class
        $.implement({
            classNames: function() {
                return classes(this[0].className);
            },
            hasClass: function(className) {
                return array.indexOf(this.classNames(), className) > -1;
            },
            addClass: function(className) {
                this.forEach(function(node) {
                    var nodeClassName = node.className;
                    var classNames = classes(nodeClassName + " " + className).join(" ");
                    if (nodeClassName != classNames) node.className = classNames;
                });
                return this;
            },
            removeClass: function(className) {
                this.forEach(function(node) {
                    var classNames = classes(node.className);
                    array.forEach(classes(className), function(className) {
                        var index = array.indexOf(classNames, className);
                        if (index > -1) classNames.splice(index, 1);
                    });
                    node.className = classNames.join(" ");
                });
                return this;
            }
        });

        // toString
        $.prototype.toString = function() {
            var tag = this.tag(), id = this.id(), classes = this.classNames();
            var str = tag;
            if (id) str += "#" + id;
            if (classes.length) str += "." + classes.join(".");
            return str;
        };

        var textProperty = document.createElement("div").textContent == null ? "innerText" : "textContent";

        // tag, html, text
        $.implement({
            tag: function() {
                return this[0].tagName.toLowerCase();
            },
            html: function(html) {
                if (html != null) {
                    this.forEach(function(node) {
                        node.innerHTML = html;
                    });
                    return this;
                }
                return this[0].innerHTML;
            },
            text: function(text) {
                if (text != undefined) {
                    this.forEach(function(node) {
                        node[textProperty] = text;
                    });
                    return this;
                }
                return this[0][textProperty];
            }
        });

        module.exports = $;
    },
    n: function(require, module, exports, global) {
        /*
elements events
*/
                "use strict";

        var $ = require("k"), array = require("o").prototype;

        module.exports = $.implement({
            // straight es5 prototypes (or emulated methods)
            forEach: array.forEach,
            map: array.map,
            filter: array.filter,
            every: array.every,
            some: array.some
        });
    },
    o: function(require, module, exports, global) {
        /*
array
 - es5 array shell
*/
                "use strict";

        var shell = require("p");

        var proto = Array.prototype;

        var array = shell({
            filter: proto.filter || function(fn, context) {
                var results = [];
                for (var i = 0, l = this.length >>> 0; i < l; i++) if (i in this) {
                    var value = this[i];
                    if (fn.call(context, value, i, this)) results.push(value);
                }
                return results;
            },
            indexOf: proto.indexOf || function(item, from) {
                for (var l = this.length >>> 0, i = from < 0 ? Math.max(0, l + from) : from || 0; i < l; i++) {
                    if (i in this && this[i] === item) return i;
                }
                return -1;
            },
            map: proto.map || function(fn, context) {
                var length = this.length >>> 0, results = Array(length);
                for (var i = 0, l = length; i < l; i++) {
                    if (i in this) results[i] = fn.call(context, this[i], i, this);
                }
                return results;
            },
            forEach: proto.forEach || function(fn, context) {
                for (var i = 0, l = this.length >>> 0; i < l; i++) {
                    if (i in this) fn.call(context, this[i], i, this);
                }
            },
            every: proto.every || function(fn, context) {
                for (var i = 0, l = this.length >>> 0; i < l; i++) {
                    if (i in this && !fn.call(context, this[i], i, this)) return false;
                }
                return true;
            },
            some: proto.some || function(fn, context) {
                for (var i = 0, l = this.length >>> 0; i < l; i++) {
                    if (i in this && fn.call(context, this[i], i, this)) return true;
                }
                return false;
            }
        });

        array.isArray = Array.isArray || function(self) {
            return Object.prototype.toString.call(self) === "[object Array]";
        };

        /*:*/
        var methods = {};

        var names = "pop,push,reverse,shift,sort,splice,unshift,concat,join,slice,lastIndexOf,reduce,reduceRight".split(",");

        for (var i = 0, name, method; name = names[i++]; ) if (method = proto[name]) methods[name] = method;

        array.implement(methods);

        module.exports = array;
    },
    p: function(require, module, exports, global) {
        /*
shell 🐚
*/
                "use strict";

        var prime = require("l"), slice = Array.prototype.slice;

        var shell = prime({
            mutator: function(key, method) {
                this[key] = function(self) {
                    var args = arguments.length > 1 ? slice.call(arguments, 1) : [];
                    return method.apply(self, args);
                };
                this.prototype[key] = method;
            },
            constructor: {
                prototype: {}
            }
        });

        module.exports = function(proto) {
            var inherits = proto.inherits || (proto.inherits = shell);
            proto.constructor = prime.create(inherits);
            return prime(proto);
        };
    },
    q: function(require, module, exports, global) {
        /*
string methods
 - inherits from es5/string
*/
                "use strict";

        var shell = require("p");

        var string = shell({
            inherits: require("r"),
            /*(string.contains)?*/
            contains: function(string, separator) {
                return (separator ? (separator + this + separator).indexOf(separator + string + separator) : (this + "").indexOf(string)) > -1;
            },
            /*:*/
            /*(string.clean)?*/
            clean: function() {
                return string.trim((this + "").replace(/\s+/g, " "));
            },
            /*:*/
            /*(string.camelize)?*/
            camelize: function() {
                return (this + "").replace(/-\D/g, function(match) {
                    return match.charAt(1).toUpperCase();
                });
            },
            /*:*/
            /*(string.hyphenate)?*/
            hyphenate: function() {
                return (this + "").replace(/[A-Z]/g, function(match) {
                    return "-" + match.toLowerCase();
                });
            },
            /*:*/
            /*(string.capitalize)?*/
            capitalize: function() {
                return (this + "").replace(/\b[a-z]/g, function(match) {
                    return match.toUpperCase();
                });
            },
            /*:*/
            /*(string.escape)?*/
            // « https://github.com/slevithan/XRegExp/blob/master/src/xregexp.js
            escape: function() {
                return (this + "").replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1");
            },
            /*:*/
            /*(string.number)?*/
            number: function() {
                return parseFloat(this);
            }
        });

        /*(string.decode)?*/
        if (typeof JSON !== "undefined") string.implement({
            decode: function() {
                return JSON.parse(this);
            }
        });

        /*:*/
        module.exports = string;
    },
    r: function(require, module, exports, global) {
        /*
string
 - es5 string shell
*/
                "use strict";

        var shell = require("p");

        var proto = String.prototype;

        var string = shell({
            trim: proto.trim || function() {
                return (this + "").replace(/^\s+|\s+$/g, "");
            }
        });

        var methods = {};

        var names = "charAt,charCodeAt,concat,indexOf,lastIndexOf,match,quote,replace,search,slice,split,substr,substring,toLowerCase,toUpperCase".split(",");

        for (var i = 0, name, method; name = names[i++]; ) if (method = proto[name]) methods[name] = method;

        string.implement(methods);

        module.exports = string;
    },
    s: function(require, module, exports, global) {
        /*
elements insertion
*/
                "use strict";

        var $ = require("n");

        // base insertion
        $.implement({
            appendChild: function(child) {
                this[0].appendChild($(child)[0]);
                return this;
            },
            insertBefore: function(child, ref) {
                this[0].insertBefore($(child)[0], $(ref)[0]);
                return this;
            },
            removeChild: function(child) {
                this[0].removeChild($(child)[0]);
                return this;
            },
            replaceChild: function(child, ref) {
                this[0].replaceChild($(child)[0], $(ref)[0]);
                return this;
            }
        });

        // before, after, bottom, top
        $.implement({
            before: function(element) {
                element = $(element)[0];
                var parent = element.parentNode;
                if (parent) this.forEach(function(node) {
                    parent.insertBefore(node, element);
                });
                return this;
            },
            after: function(element) {
                element = $(element)[0];
                var parent = element.parentNode;
                if (parent) this.forEach(function(node) {
                    parent.insertBefore(node, element.nextSibling);
                });
                return this;
            },
            bottom: function(element) {
                element = $(element)[0];
                this.forEach(function(node) {
                    element.appendChild(node);
                });
                return this;
            },
            top: function(element) {
                element = $(element)[0];
                this.forEach(function(node) {
                    element.insertBefore(node, element.firstChild);
                });
                return this;
            }
        });

        // insert, replace
        $.implement({
            insert: $.prototype.bottom,
            replace: function(element) {
                element = $(element)[0];
                element.parentNode.replaceChild(this[0], element);
                return this;
            }
        });

        module.exports = $;
    },
    t: function(require, module, exports, global) {
        /*
elements events
*/
                "use strict";

        var $ = require("k"), prime = require("l"), Emitter = require("u");

        var html = document.documentElement;

        var addEventListener = html.addEventListener ? function(node, event, handle) {
            node.addEventListener(event, handle, false);
            return handle;
        } : function(node, event, handle) {
            node.attachEvent("on" + event, handle);
            return handle;
        };

        var removeEventListener = html.removeEventListener ? function(node, event, handle) {
            node.removeEventListener(event, handle, false);
        } : function(node, event, handle) {
            node.detachEvent("on" + event, handle);
        };

        var NodesEmitter = prime({
            inherits: Emitter,
            on: function(event, handle) {
                this.handle(function(node) {
                    NodesEmitter.parent.on.call(this, event, handle);
                    var self = this, domListeners = this._domListeners || (this._domListeners = {});
                    if (!domListeners[event]) domListeners[event] = addEventListener(node, event, function(e) {
                        self.emit(event, e || window.event);
                    });
                });
                return this;
            },
            off: function(event, handle) {
                this.handle(function(node) {
                    var domListeners = this._domListeners, domEvent, listeners = this._listeners, events;
                    if (domListeners && (domEvent = domListeners[event]) && listeners && (events = listeners[event])) {
                        NodesEmitter.parent.off.call(this, event, handle);
                        var empty = true, k, l;
                        for (k in events) {
                            empty = false;
                            break;
                        }
                        if (empty) {
                            removeEventListener(node, event, domEvent);
                            delete domListeners[event];
                            for (l in domListeners) empty = false;
                            if (empty) delete this._domListeners;
                        }
                    }
                });
                return this;
            },
            emit: function(event) {
                var args = arguments;
                this.handle(function(node) {
                    NodesEmitter.parent.emit.apply(this, args);
                });
                return this;
            }
        });

        module.exports = $.use(NodesEmitter);
    },
    u: function(require, module, exports, global) {
        /*
Emitter
*/
                "use strict";

        var prime = require("l"), array = require("o");

        module.exports = prime({
            on: function(event, fn) {
                var listeners = this._listeners || (this._listeners = {}), events = listeners[event] || (listeners[event] = []);
                if (!events.length || array.indexOf(events, fn) === -1) events.push(fn);
                return this;
            },
            off: function(event, fn) {
                var listeners = this._listeners, events;
                if (listeners && (events = listeners[event]) && events.length) {
                    var index = array.indexOf(events, fn);
                    if (index > -1) events.splice(index, 1);
                }
                return this;
            },
            emit: function(event) {
                var listeners = this._listeners, events;
                if (listeners && (events = listeners[event]) && events.length) {
                    var args = arguments.length > 1 ? array.slice(arguments, 1) : [];
                    array.forEach(events.slice(), function(event) {
                        event.apply(this, args);
                    }, this);
                }
                return this;
            }
        });
    },
    v: function(require, module, exports, global) {
        /*
zen
*/
                "use strict";

        var parse = require("f"), array = require("5"), $ = require("4");

        module.exports = function(expression, doc) {
            return $(array.map(parse(expression), function(expression) {
                var previous, result;
                array.forEach(expression, function(part, i) {
                    var node = (doc || document).createElement(part.tag);
                    if (part.id) node.id = part.id;
                    if (part.classList) node.className = part.classList.join(" ");
                    if (part.attributes) array.forEach(part.attributes, function(attribute) {
                        node.setAttribute(attribute.name, attribute.value);
                    });
                    if (part.pseudos) array.forEach(part.pseudos, function(pseudo) {
                        var n = $(node), method = n[pseudo.name];
                        if (method) method.call(n, pseudo.value);
                    });
                    if (i === 0) {
                        result = node;
                    } else if (part.combinator === " ") {
                        previous.appendChild(node);
                    } else if (part.combinator === "+") {
                        var parentNode = previous.parentNode;
                        if (parentNode) parentNode.appendChild(node);
                    }
                    previous = node;
                });
                return result;
            }));
        };
    },
    w: function(require, module, exports, global) {
                "use strict";

        var prime = require("1");

        var slice = Array.prototype.slice;

        function mixin(object) {
            var mixins = slice.call(arguments, 1);
            for (var i = 0; i < mixins.length; i++) {
                object.implement(prime.create(mixins[i].prototype));
            }
            return object;
        }

        module.exports = mixin;
    },
    x: function(require, module, exports, global) {
                "use strict";

        // credits to @cpojer's Class.Binds, released under the MIT license
        // https://github.com/cpojer/mootools-class-extras/blob/master/Source/Class.Binds.js
        var prime = require("1");

        var fn = require("y");

        var bound = prime({
            bound: function(name) {
                var bound = this._bound || (this._bound = {});
                return bound[name] || (bound[name] = fn.bound(this[name], this));
            }
        });

        module.exports = bound;
    },
    y: function(require, module, exports, global) {
        /*
function methods
*/
                "use strict";

        var shell = require("6");

        var slice = Array.prototype.slice;

        var fn = shell({
            bound: function(thisArg) {
                var args = slice.call(arguments, 1), self = this;
                return function() {
                    return self.apply(thisArg, args.concat(slice.call(arguments)));
                };
            }
        });

        module.exports = fn;
    },
    z: function(require, module, exports, global) {
        /*
list
 - to be used with any object that has a length and numeric keys
 - generates generics
*/
                "use strict";

        var shell = require("6");

        // set, get, count, each, map, filter, every, some, index, merge, remove, keys, values
        var list = shell({
            inherits: require("5"),
            set: function(i, value) {
                this[i] = value;
                return this;
            },
            get: function(i) {
                return i in this ? this[i] : null;
            },
            count: function() {
                return this.length;
            },
            each: function(method, context) {
                for (var i = 0, l = this.length; i < l; i++) {
                    if (i in this && method.call(context, this[i], i, this) === false) break;
                }
                return this;
            },
            index: function(value) {
                var index = list.indexOf(this, value);
                return index == -1 ? null : index;
            },
            remove: function(i) {
                return list.splice(this, i, 1)[0];
            },
            keys: function() {
                return list.map(this, function(v, i) {
                    return i;
                });
            },
            values: function() {
                return list.slice(this);
            }
        });

        module.exports = list;
    },
    "10": function(require, module, exports, global) {
                "Use Strict";

        var prime = require("1");

        var mixin = require("w");

        var bound = require("x");

        var Options = require("11");

        var list = require("z");

        var string = require("9");

        var number = require("14");

        var lev = require("16");

        var sift3 = require("17");

        var FuzzySearch = prime({
            options: {
                maxDistanceTolerance: 3,
                maxWordTolerance: 3,
                minTermLength: 3,
                maxIterations: 500,
                caseSensitive: false,
                wordCountFactor: 1,
                indexOfFactor: 3,
                distanceFactor: 3,
                distanceMethod: 1
            },
            constructor: function(searchSet, options) {
                this.setOptions(options);
                this.searchSet = searchSet;
            },
            search: function(needle) {
                var needle = string.clean(needle);
                var result = [];
                list.each(this.searchSet, function(value) {
                    var value = string.clean(value);
                    var score = this.getOverallPoints(needle, value);
                    result.push({
                        score: score.score,
                        detailedScore: score.detailedScore,
                        value: value
                    });
                }, this);
                return result.sort(function(a, b) {
                    return b.score - a.score;
                });
            },
            getOverallPoints: function(needle, haystack) {
                if (!this.options.caseSensitive) {
                    var needle = needle.toLowerCase();
                    var haystack = haystack.toLowerCase();
                }
                if (needle == haystack) {
                    return {
                        score: this.getMaximumScore(),
                        detailedScore: {
                            indexPoints: 100 * this.options.indexOfFactor,
                            wordCountPoints: 100 * this.options.wordCountFactor,
                            distanceScore: 100 * this.options.distanceFactor
                        }
                    };
                }
                var indexOfMatches = this.getIndexOfMatches(needle, haystack);
                var indexPoints = this.getIndexOfPoints(indexOfMatches, needle);
                var wordCountPoints = this.getWordCountPoints(needle, haystack);
                var distanceMatches = this.getDistanceMatches(needle, haystack);
                var distanceScore = this.getDistanceScore(distanceMatches, haystack);
                return {
                    score: indexPoints * this.options.indexOfFactor + wordCountPoints * this.options.wordCountFactor + distanceScore * this.options.distanceFactor,
                    detailedScore: {
                        indexPoints: indexPoints * this.options.indexOfFactor,
                        wordCountPoints: wordCountPoints * this.options.wordCountFactor,
                        distanceScore: distanceScore * this.options.distanceFactor
                    }
                };
            },
            getMaximumScore: function() {
                return 100 * (this.options.indexOfFactor + this.options.wordCountFactor + this.options.distanceFactor);
            },
            getIndexOfMatches: function(needle, haystack) {
                this.haystack = haystack;
                var minLength = needle.length >= this.options.minTermLength ? this.options.minTermLength : needle.length;
                var needle = needle;
                var matches = [];
                var iterations = 0;
                do {
                    var cm = this.getClosestMatch(needle);
                    if (cm.length >= minLength) {
                        matches.push(cm);
                    }
                    var substrc = cm.length - 1 > 0 ? cm.length : 1;
                    needle = needle.substr(substrc);
                    iterations++;
                } while (needle.length >= minLength && iterations <= this.options.maxIterations);
                return matches;
            },
            getIndexOfPoints: function(results, needle) {
                var sum = 0;
                list.each(results, function(result) {
                    sum += result.length;
                });
                return 100 / needle.length * sum;
            },
            getDistanceMatches: function(needle, haystack) {
                var needleWords = needle.split(" ");
                var haystackWords = haystack.split(" ");
                if (this.CONST["DISTANCE_METHOD_SIFT3"] == this.options.distanceMethod && !this.sift3) {
                    this.sift3 = new sift3(haystack);
                } else if (this.sift3) {
                    this.sift3.setHaystack(haystack);
                }
                var matches = [];
                var nwl = needleWords.length;
                var hwl = haystackWords.length;
                for (var i = 0; i < nwl; i++) {
                    for (var j = 0; j < hwl; j++) {
                        var needleWord = needleWords[i];
                        var haystackWord = haystackWords[j];
                        var score;
                        if (this.CONST["DISTANCE_METHOD_LEVENSHTEIN"] == this.options.distanceMethod) {
                            score = lev(needleWord, haystackWord);
                        } else if (this.CONST["DISTANCE_METHOD_SIFT3"] == this.options.distanceMethod) {
                            score = this.sift3.getDifference(needleWord);
                        }
                        if (score <= this.options.maxDistanceTolerance) {
                            matches.push({
                                match: needleWord,
                                score: score
                            });
                        }
                    }
                }
                return matches;
            },
            getDistanceScore: function(results, haystack) {
                var haystackWords = haystack.split(" ");
                var combinedScore = 0;
                list.each(results, function(result) {
                    combinedScore += result.score;
                });
                combinedScore += (haystackWords.length - results.length) * this.options.maxDistanceTolerance;
                var points = 50 / haystackWords.length * results.length;
                points += 50 / (haystackWords.length * this.options.maxDistanceTolerance) * (haystackWords.length * this.options.maxDistanceTolerance - combinedScore);
                return points;
            },
            getWordCountPoints: function(needle, haystack) {
                var needleWords = needle.split(" ");
                var haystackWords = haystack.split(" ");
                return 100 / this.options.maxWordTolerance * (this.options.maxWordTolerance - number.limit(Math.abs(haystackWords.length - needleWords.length), 0, this.options.maxWordTolerance));
            },
            getClosestMatch: function(needle, haystack) {
                var haystack = this.haystack;
                if (haystack.indexOf(needle) != -1) {
                    return needle;
                }
                var length = needle.length;
                var lastMatchingString = "";
                for (var i = 0; i <= length; i++) {
                    var term = needle.substr(0, i);
                    if (haystack.indexOf(term) != -1) {
                        continue;
                    }
                    return term.substr(0, i - 1);
                }
                return "";
            }
        });

        FuzzySearch.CONST = FuzzySearch.prototype.CONST = {
            DISTANCE_METHOD_LEVENSHTEIN: 1,
            DISTANCE_METHOD_SIFT3: 2
        };

        mixin(FuzzySearch, Options, bound);

        module.exports = FuzzySearch;
    },
    "11": function(require, module, exports, global) {
                "use strict";

        var prime = require("1");

        var object = require("12");

        var Options = prime({
            setOptions: function(options) {
                var args = [ {}, this.options ];
                args.push.apply(args, arguments);
                this.options = object.merge.apply(null, args);
                if (!options) {
                    return;
                }
                this.options = object.merge(this.options, options);
            }
        });

        module.exports = Options;
    },
    "12": function(require, module, exports, global) {
        /*
object methods
*/
                "use strict";

        var shell = require("6");

        var type = require("13");

        var object = shell({
            merge: function(key, value) {
                if (typeof key == "string") {
                    if (type(this[key]) == "object" && type(value[key] == "object")) object.merge(this[key], value); else this[key] = value;
                } else for (var i = 0; i < arguments.length; i++) {
                    var obj = arguments[i];
                    for (var k in obj) object.merge(this, k, obj[k]);
                }
                return this;
            }
        });

        module.exports = object;
    },
    "13": function(require, module, exports, global) {
        /*
type
*/
                "use strict";

        var toString = Object.prototype.toString, types = /number|object|array|string|function|date|regexp|boolean/;

        var type = function(object) {
            if (object == null) return "null";
            var string = toString.call(object).slice(8, -1).toLowerCase();
            if (string === "number" && isNaN(object)) return "null";
            if (types.test(string)) return string;
            return "object";
        };

        module.exports = type;
    },
    "14": function(require, module, exports, global) {
        /*
number methods
 - inherits from es5/number
*/
                "use strict";

        var shell = require("6");

        var number = shell({
            inherits: require("15"),
            /*(number.limit)?*/
            limit: function(min, max) {
                return Math.min(max, Math.max(min, this));
            },
            /*:*/
            /*(number.round)?*/
            round: function(precision) {
                precision = Math.pow(10, precision || 0).toFixed(precision < 0 ? -precision : 0);
                return Math.round(this * precision) / precision;
            },
            /*:*/
            /*(number.times)?*/
            times: function(fn, context) {
                for (var i = 0; i < this; i++) fn.call(context, i, null, this);
                return this;
            },
            /*:*/
            /*(numer.random)?*/
            random: function(max) {
                return Math.floor(Math.random() * (max - this + 1) + this);
            }
        });

        module.exports = number;
    },
    "15": function(require, module, exports, global) {
        /*
number
 - es5 number shell
*/
                "use strict";

        var shell = require("6");

        var proto = Number.prototype;

        var number = shell({
            toExponential: proto.toExponential,
            toFixed: proto.toFixed,
            toPrecision: proto.toPrecision
        });

        module.exports = number;
    },
    "16": function(require, module, exports, global) {
        // Generics
                if (!Array.forEach) {
            Array.forEach = function forEach(array, iterator, context) {
                iterator = context ? iterator.bind(context) : iterator;
                Array.prototype.forEach.call(array, iterator);
            };
        }

        // Levenshtein distance
        function Levenshtein(str_m, str_n) {
            var previous, current, matrix;
            // Instance methods
            this.valueOf = function() {
                return this.distance;
            };
            this.toString = this.inspect = function inspect(no_print) {
                var max, buff, sep, rows;
                max = matrix.reduce(function(m, o) {
                    return Math.max(m, o.reduce(Math.max, 0));
                }, 0);
                buff = Array((max + "").length).join(" ");
                sep = [];
                while (sep.length < (matrix[0] && matrix[0].length || 0)) sep[sep.length] = Array(buff.length + 1).join("-");
                sep = sep.join("-+") + "-";
                rows = matrix.map(function(row) {
                    var cells;
                    cells = row.map(function(cell) {
                        return (buff + cell).slice(-buff.length);
                    });
                    return cells.join(" |") + " ";
                });
                return rows.join("\n" + sep + "\n");
            };
            // Constructor
            matrix = [];
            // Sanity checks
            if (str_m == str_n) return this.distance = 0; else if (str_m == "") return this.distance = str_n.length; else if (str_n == "") return this.distance = str_m.length; else {
                // Danger Will Robinson
                previous = [ 0 ];
                Array.forEach(str_m, function(v, i) {
                    i++, previous[i] = i;
                });
                matrix[0] = previous;
                Array.forEach(str_n, function(n_val, n_idx) {
                    current = [ ++n_idx ];
                    Array.forEach(str_m, function(m_val, m_idx) {
                        m_idx++;
                        if (str_m.charAt(m_idx - 1) == str_n.charAt(n_idx - 1)) current[m_idx] = previous[m_idx - 1]; else current[m_idx] = Math.min(previous[m_idx] + 1, current[m_idx - 1] + 1, previous[m_idx - 1] + 1);
                    });
                    previous = current;
                    matrix[matrix.length] = previous;
                });
                return this.distance = current[current.length - 1];
            }
        }

        // Export
        module.exports = Levenshtein;
    },
    "17": function(require, module, exports, global) {
        // sift3 - http://siderite.blogspot.com/2007/04/super-fast-and-accurate-string-distance.HTMLElement
                "Use Strict";

        var prime = require("1");

        var sift3 = prime({
            constructor: function(haystack) {
                this.haystack = haystack;
            },
            getDifference: function(term) {
                var s1 = term, s2 = this.haystack, c = 0, offset1 = 0, offset2 = 0, lcs = 0, maxOffset = 5, i = 0;
                if (s1 == null || s1.length === 0) {
                    if (s2 == null || s2.length === 0) {
                        return 0;
                    } else {
                        return s2.length;
                    }
                }
                if (s2 == null || s2.length === 0) {
                    return s1.length;
                }
                while (c + offset1 < s1.length && c + offset2 < s2.length) {
                    if (s1.charAt(c + offset1) == s2.charAt(c + offset2)) {
                        lcs++;
                    } else {
                        offset1 = 0;
                        offset2 = 0;
                        for (;i < maxOffset; i++) {
                            if (c + i < s1.length && s1.charAt(c + i) == s2.charAt(c)) {
                                offset1 = i;
                                break;
                            }
                            if (c + i < s2.length && s1.charAt(c) == s2.charAt(c + i)) {
                                offset2 = i;
                                break;
                            }
                        }
                    }
                    c++;
                }
                return (s1.length + s2.length) / 2 - lcs;
            },
            setHaystack: function(haystack) {
                this.haystack = haystack;
            }
        });

        module.exports = sift3;
    }
});