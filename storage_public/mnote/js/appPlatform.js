/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var cc = cc || {};

/**
 * Common getter setter configuration function
 * @function
 * @param {Object}   proto      A class prototype or an object to config<br/>
 * @param {String}   prop       Property name
 * @param {function} getter     Getter function for the property
 * @param {function} setter     Setter function for the property
 * @param {String}   getterName Name of getter function for the property
 * @param {String}   setterName Name of setter function for the property
 */
cc.defineGetterSetter = function (proto, prop, getter, setter, getterName, setterName) {
    if (proto.__defineGetter__) {
        getter && proto.__defineGetter__(prop, getter);
        setter && proto.__defineSetter__(prop, setter);
    } else if (Object.defineProperty) {
        var desc = {enumerable: false, configurable: true};
        getter && (desc.get = getter);
        setter && (desc.set = setter);
        Object.defineProperty(proto, prop, desc);
    } else {
        throw new Error("browser does not support getters");
    }

    if (!getterName && !setterName) {
        // Lookup getter/setter function
        var hasGetter = (getter != null), hasSetter = (setter != undefined), props = Object.getOwnPropertyNames(proto);
        for (var i = 0; i < props.length; i++) {
            var name = props[i];

            if ((proto.__lookupGetter__ ? proto.__lookupGetter__(name)
                    : Object.getOwnPropertyDescriptor(proto, name))
                || typeof proto[name] !== "function")
                continue;

            var func = proto[name];
            if (hasGetter && func === getter) {
                getterName = name;
                if (!hasSetter || setterName) break;
            }
            if (hasSetter && func === setter) {
                setterName = name;
                if (!hasGetter || getterName) break;
            }
        }
    }

    // Found getter/setter
    var ctor = proto.constructor;
    if (getterName) {
        if (!ctor.__getters__) {
            ctor.__getters__ = {};
        }
        ctor.__getters__[getterName] = prop;
    }
    if (setterName) {
        if (!ctor.__setters__) {
            ctor.__setters__ = {};
        }
        ctor.__setters__[setterName] = prop;
    }
};

/**
 * Create a new object and copy all properties in an exist object to the new object
 * @function
 * @param {object|Array} obj The source object
 * @return {Array|object} The created object
 */
cc.clone = function (obj) {
    // Cloning is better if the new object is having the same prototype chain
    // as the copied obj (or otherwise, the cloned object is certainly going to
    // have a different hidden class). Play with C1/C2 of the
    // PerformanceVirtualMachineTests suite to see how this makes an impact
    // under extreme conditions.
    //
    // Object.create(Object.getPrototypeOf(obj)) doesn't work well because the
    // prototype lacks a link to the constructor (Carakan, V8) so the new
    // object wouldn't have the hidden class that's associated with the
    // constructor (also, for whatever reasons, utilizing
    // Object.create(Object.getPrototypeOf(obj)) + Object.defineProperty is even
    // slower than the original in V8). Therefore, we call the constructor, but
    // there is a big caveat - it is possible that the this.init() in the
    // constructor would throw with no argument. It is also possible that a
    // derived class forgets to set "constructor" on the prototype. We ignore
    // these possibities for and the ultimate solution is a standardized
    // Object.clone(<object>).
    var newObj = (obj.constructor) ? new obj.constructor : {};

    // Assuming that the constuctor above initialized all properies on obj, the
    // following keyed assignments won't turn newObj into dictionary mode
    // because they're not *appending new properties* but *assigning existing
    // ones* (note that appending indexed properties is another story). See
    // CCClass.js for a link to the devils when the assumption fails.
    for (var key in obj) {
        var copy = obj[key];
        // Beware that typeof null == "object" !
        if (((typeof copy) === "object") && copy && !(copy instanceof cc.Node) && !(copy instanceof HTMLElement)) {
            newObj[key] = cc.clone(copy);
        } else {
            newObj[key] = copy;
        }
    }
    return newObj;
};

cc.inject = function (srcPrototype, destPrototype) {
    for (var key in srcPrototype)
        destPrototype[key] = srcPrototype[key];
};

/**
 * @namespace
 * @name ClassManager
 */
var ClassManager = function () {
    var id = (0|(Math.random()*998));
    var instanceId = (0|(Math.random()*998));

    this.getNewID = function () {
        return id++;
    };

    this.getNewInstanceId = function () {
        return instanceId++;
    };
};
var classManager = new ClassManager();

/* Managed JavaScript Inheritance
 * Based on John Resig's Simple JavaScript Inheritance http://ejohn.org/blog/simple-javascript-inheritance/
 * MIT Licensed.
 */
(function () {
    var fnTest = /\b_super\b/;

    /**
     * The base Class implementation (does nothing)
     * @class
     */
    cc.Class = function () {
    };

    /**
     * Create a new Class that inherits from this Class
     * @static
     * @param {object} props
     * @return {function}
     */
    cc.Class.extend = function (props) {
        var _super = this.prototype;

        // Instantiate a base Class (but only create the instance,
        // don't run the init constructor)
        var prototype = Object.create(_super);

        // Copy the properties over onto the new prototype. We make function
        // properties non-eumerable as this makes typeof === 'function' check
        // unnecessary in the for...in loop used 1) for generating Class()
        // 2) for cc.clone and perhaps more. It is also required to make
        // these function properties cacheable in Carakan.
        var desc = {writable: true, enumerable: false, configurable: true};

        // The dummy Class constructor
        var Class;

            Class = function (arg0, arg1, arg2, arg3, arg4) {
                this.__instanceId = classManager.getNewInstanceId();
                if (this.ctor) {
                    switch (arguments.length) {
                        case 0: this.ctor(); break;
                        case 1: this.ctor(arg0); break;
                        case 2: this.ctor(arg0, arg1); break;
                        case 3: this.ctor(arg0, arg1, arg2); break;
                        case 4: this.ctor(arg0, arg1, arg2, arg3); break;
                        case 5: this.ctor(arg0, arg1, arg2, arg3, arg4); break;
                        default: this.ctor.apply(this, arguments);
                    }
                }
            };


        desc.value = classManager.getNewID();
        Object.defineProperty(prototype, '__pid', desc);

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        desc.value = Class;
        Object.defineProperty(prototype, 'constructor', desc);

        // Copy getter/setter
        this.__getters__ && (Class.__getters__ = cc.clone(this.__getters__));
        this.__setters__ && (Class.__setters__ = cc.clone(this.__setters__));

        for (var idx = 0, li = arguments.length; idx < li; ++idx) {
            var prop = arguments[idx];
            for (var name in prop) {
                var isFunc = (typeof prop[name] === "function");
                var override = (typeof _super[name] === "function");
                var hasSuperCall = fnTest.test(prop[name]);

                if (isFunc && override && hasSuperCall) {
                    desc.value = (function (name, fn) {
                        return function () {
                            var tmp = this._super;

                            // Add a new ._super() method that is the same method
                            // but on the super-Class
                            this._super = _super[name];

                            // The method only need to be bound temporarily, so we
                            // remove it when we're done executing
                            var ret = fn.apply(this, arguments);
                            this._super = tmp;

                            return ret;
                        };
                    })(name, prop[name]);
                    Object.defineProperty(prototype, name, desc);
                } else if (isFunc) {
                    desc.value = prop[name];
                    Object.defineProperty(prototype, name, desc);
                } else {
                    prototype[name] = prop[name];
                }

                if (isFunc) {
                    // Override registered getter/setter
                    var getter, setter, propertyName;
                    if (this.__getters__ && this.__getters__[name]) {
                        propertyName = this.__getters__[name];
                        for (var i in this.__setters__) {
                            if (this.__setters__[i] === propertyName) {
                                setter = i;
                                break;
                            }
                        }
                        cc.defineGetterSetter(prototype, propertyName, prop[name], prop[setter] ? prop[setter] : prototype[setter], name, setter);
                    }
                    if (this.__setters__ && this.__setters__[name]) {
                        propertyName = this.__setters__[name];
                        for (var i in this.__getters__) {
                            if (this.__getters__[i] === propertyName) {
                                getter = i;
                                break;
                            }
                        }
                        cc.defineGetterSetter(prototype, propertyName, prop[getter] ? prop[getter] : prototype[getter], prop[name], getter, name);
                    }
                }
            }
        }

        // And make this Class extendable
        Class.extend = cc.Class.extend;

        //add implementation method
        Class.implement = function (prop) {
            for (var name in prop) {
                prototype[name] = prop[name];
            }
        };
        return Class;
    };
})();

/**
 * Iterate over an object or an array, executing a function for each matched element.
 * @param {object|array} obj
 * @param {function} iterator
 * @param {object} [context]
 */
cc.each = function (obj, iterator, context) {
    if (!obj)
        return;
    if (obj instanceof Array) {
        for (var i = 0, li = obj.length; i < li; i++) {
            if (iterator.call(context, obj[i], i) === false)
                return;
        }
    } else {
        for (var key in obj) {
            if (iterator.call(context, obj[key], key) === false)
                return;
        }
    }
};

/**
 * Copy all of the properties in source objects to target object and return the target object.
 * @param {object} target
 * @param {object} *sources
 * @returns {object}
 */
cc.extend = function (target) {
    var sources = arguments.length >= 2 ? Array.prototype.slice.call(arguments, 1) : [];

    cc.each(sources, function (src) {
        for (var key in src) {
            if (src.hasOwnProperty(key)) {
                target[key] = src[key];
            }
        }
    });
    return target;
};

/**
 * Another way to subclass: Using Google Closure.
 * The following code was copied + pasted from goog.base / goog.inherits
 * @function
 * @param {Function} childCtor
 * @param {Function} parentCtor
 */
cc.inherits = function (childCtor, parentCtor) {
    function tempCtor() {}
    tempCtor.prototype = parentCtor.prototype;
    childCtor.superClass_ = parentCtor.prototype;
    childCtor.prototype = new tempCtor();
    childCtor.prototype.constructor = childCtor;

    // Copy "static" method, but doesn't generate subclasses.
    // for( var i in parentCtor ) {
    // childCtor[ i ] = parentCtor[ i ];
    // }
};

/**
 * Check the obj whether is function or not
 * @param {*} obj
 * @returns {boolean}
 */
cc.isFunction = function (obj) {
    return typeof obj === 'function';
};

/**
 * Check the obj whether is number or not
 * @param {*} obj
 * @returns {boolean}
 */
cc.isNumber = function (obj) {
    return typeof obj === 'number' || Object.prototype.toString.call(obj) === '[object Number]';
};

/**
 * Check the obj whether is string or not
 * @param {*} obj
 * @returns {boolean}
 */
cc.isString = function (obj) {
    return typeof obj === 'string' || Object.prototype.toString.call(obj) === '[object String]';
};

/**
 * Check the obj whether is array or not
 * @param {*} obj
 * @returns {boolean}
 */
cc.isArray = function (obj) {
    return Array.isArray(obj) ||
        (typeof obj === 'object' && Object.prototype.toString.call(obj) === '[object Array]');
};

/**
 * Check the obj whether is undefined or not
 * @param {*} obj
 * @returns {boolean}
 */
cc.isUndefined = function (obj) {
    return typeof obj === 'undefined';
};

/**
 * Check the obj whether is object or not
 * @param {*} obj
 * @returns {boolean}
 */
cc.isObject = function (obj) {
    return typeof obj === "object" && Object.prototype.toString.call(obj) === '[object Object]';
};

/**
 * Check the url whether cross origin
 * @param {String} url
 * @returns {boolean}
 */
cc.isCrossOrigin = function (url) {
    if (!url) {
        cc.log("invalid URL");
        return false;
    }
    var startIndex = url.indexOf("://");
    if (startIndex === -1)
        return false;

    var endIndex = url.indexOf("/", startIndex + 3);
    var urlOrigin = (endIndex === -1) ? url : url.substring(0, endIndex);
    return urlOrigin !== location.origin;
};

//+++++++++++++++++++++++++something about async begin+++++++++++++++++++++++++++++++
/**
 * Async Pool class, a helper of cc.async
 * @param {Object|Array} srcObj
 * @param {Number} limit the limit of parallel number
 * @param {function} iterator
 * @param {function} onEnd
 * @param {object} target
 * @constructor
 */
cc.AsyncPool = function (srcObj, limit, iterator, onEnd, target) {
    var self = this;
    self._finished = false;
    self._srcObj = srcObj;
    self._limit = limit;
    self._pool = [];
    self._iterator = iterator;
    self._iteratorTarget = target;
    self._onEnd = onEnd;
    self._onEndTarget = target;
    self._results = srcObj instanceof Array ? [] : {};
    self._errors = srcObj instanceof Array ? [] : {};

    cc.each(srcObj, function (value, index) {
        self._pool.push({index: index, value: value});
    });

    self.size = self._pool.length;
    self.finishedSize = 0;
    self._workingSize = 0;

    self._limit = self._limit || self.size;

    self.onIterator = function (iterator, target) {
        self._iterator = iterator;
        self._iteratorTarget = target;
    };

    self.onEnd = function (endCb, endCbTarget) {
        self._onEnd = endCb;
        self._onEndTarget = endCbTarget;
    };

    self._handleItem = function () {
        var self = this;
        if (self._pool.length === 0 || self._workingSize >= self._limit)
            return;                                                         //return directly if the array's length = 0 or the working size great equal limit number

        var item = self._pool.shift();
        var value = item.value, index = item.index;
        self._workingSize++;
        self._iterator.call(self._iteratorTarget, value, index,
            function (err, result) {
                if (self._finished) {
                    return;
                }

                if (err) {
                    self._errors[this.index] = err;
                }
                else {
                    self._results[this.index] = result;
                }

                self.finishedSize++;
                self._workingSize--;
                if (self.finishedSize === self.size) {
                    var errors = self._errors.length === 0 ? null : self._errors;
                    self.onEnd(errors, self._results);
                    return;
                }
                self._handleItem();
            }.bind(item),
            self);
    };

    self.flow = function () {
        var self = this;
        if (self._pool.length === 0) {
            if (self._onEnd)
                self._onEnd.call(self._onEndTarget, null, []);
            return;
        }
        for (var i = 0; i < self._limit; i++)
            self._handleItem();
    };

    self.onEnd = function(errors, results) {
        self._finished = true;
        if (self._onEnd) {
            var selector = self._onEnd;
            var target = self._onEndTarget;
            self._onEnd = null;
            self._onEndTarget = null;
            selector.call(target, errors, results);
        }
    };
};

/**
 * @class
 */
cc.async = /** @lends cc.async# */{
    /**
     * Do tasks series.
     * @param {Array|Object} tasks
     * @param {function} [cb] callback
     * @param {Object} [target]
     * @return {cc.AsyncPool}
     */
    series: function (tasks, cb, target) {
        var asyncPool = new cc.AsyncPool(tasks, 1, function (func, index, cb1) {
            func.call(target, cb1);
        }, cb, target);
        asyncPool.flow();
        return asyncPool;
    },

    /**
     * Do tasks parallel.
     * @param {Array|Object} tasks
     * @param {function} cb callback
     * @param {Object} [target]
     * @return {cc.AsyncPool}
     */
    parallel: function (tasks, cb, target) {
        var asyncPool = new cc.AsyncPool(tasks, 0, function (func, index, cb1) {
            func.call(target, cb1);
        }, cb, target);
        asyncPool.flow();
        return asyncPool;
    },

    /**
     * Do tasks waterfall.
     * @param {Array|Object} tasks
     * @param {function} cb callback
     * @param {Object} [target]
     * @return {cc.AsyncPool}
     */
    waterfall: function (tasks, cb, target) {
        var args = [];
        var lastResults = [null];//the array to store the last results
        var asyncPool = new cc.AsyncPool(tasks, 1,
            function (func, index, cb1) {
                args.push(function (err) {
                    args = Array.prototype.slice.call(arguments, 1);
                    if (tasks.length - 1 === index) lastResults = lastResults.concat(args);//while the last task
                    cb1.apply(null, arguments);
                });
                func.apply(target, args);
            }, function (err) {
                if (!cb)
                    return;
                if (err)
                    return cb.call(target, err);
                cb.apply(target, lastResults);
            });
        asyncPool.flow();
        return asyncPool;
    },

    /**
     * Do tasks by iterator.
     * @param {Array|Object} tasks
     * @param {function|Object} iterator
     * @param {function} [callback]
     * @param {Object} [target]
     * @return {cc.AsyncPool}
     */
    map: function (tasks, iterator, callback, target) {
        var locIterator = iterator;
        if (typeof(iterator) === "object") {
            callback = iterator.cb;
            target = iterator.iteratorTarget;
            locIterator = iterator.iterator;
        }
        var asyncPool = new cc.AsyncPool(tasks, 0, locIterator, callback, target);
        asyncPool.flow();
        return asyncPool;
    },

    /**
     * Do tasks by iterator limit.
     * @param {Array|Object} tasks
     * @param {Number} limit
     * @param {function} iterator
     * @param {function} cb callback
     * @param {Object} [target]
     */
    mapLimit: function (tasks, limit, iterator, cb, target) {
        var asyncPool = new cc.AsyncPool(tasks, limit, iterator, cb, target);
        asyncPool.flow();
        return asyncPool;
    }
};
//+++++++++++++++++++++++++something about async end+++++++++++++++++++++++++++++++++

//+++++++++++++++++++++++++something about path begin++++++++++++++++++++++++++++++++
/**
 * @class
 */
cc.path = /** @lends cc.path# */{
    normalizeRE: /[^\.\/]+\/\.\.\//,

    /**
     * Join strings to be a path.
     * @example
     cc.path.join("a", "b.png");//-->"a/b.png"
     cc.path.join("a", "b", "c.png");//-->"a/b/c.png"
     cc.path.join("a", "b");//-->"a/b"
     cc.path.join("a", "b", "/");//-->"a/b/"
     cc.path.join("a", "b/", "/");//-->"a/b/"
     * @returns {string}
     */
    join: function () {
        var l = arguments.length;
        var result = "";
        for (var i = 0; i < l; i++) {
            result = (result + (result === "" ? "" : "/") + arguments[i]).replace(/(\/|\\\\)$/, "");
        }
        return result;
    },

    /**
     * Get the ext name of a path.
     * @example
     cc.path.extname("a/b.png");//-->".png"
     cc.path.extname("a/b.png?a=1&b=2");//-->".png"
     cc.path.extname("a/b");//-->null
     cc.path.extname("a/b?a=1&b=2");//-->null
     * @param {string} pathStr
     * @returns {*}
     */
    extname: function (pathStr) {
        var temp = /(\.[^\.\/\?\\]*)(\?.*)?$/.exec(pathStr);
        return temp ? temp[1] : null;
    },

    /**
     * Get the main name of a file name
     * @param {string} fileName
     * @returns {string}
     */
    mainFileName: function (fileName) {
        if (fileName) {
            var idx = fileName.lastIndexOf(".");
            if (idx !== -1)
                return fileName.substring(0, idx);
        }
        return fileName;
    },

    /**
     * Get the file name of a file path.
     * @example
     cc.path.basename("a/b.png");//-->"b.png"
     cc.path.basename("a/b.png?a=1&b=2");//-->"b.png"
     cc.path.basename("a/b.png", ".png");//-->"b"
     cc.path.basename("a/b.png?a=1&b=2", ".png");//-->"b"
     cc.path.basename("a/b.png", ".txt");//-->"b.png"
     * @param {string} pathStr
     * @param {string} [extname]
     * @returns {*}
     */
    basename: function (pathStr, extname) {
        var index = pathStr.indexOf("?");
        if (index > 0) pathStr = pathStr.substring(0, index);
        var reg = /(\/|\\\\)([^(\/|\\\\)]+)$/g;
        var result = reg.exec(pathStr.replace(/(\/|\\\\)$/, ""));
        if (!result) return null;
        var baseName = result[2];
        if (extname && pathStr.substring(pathStr.length - extname.length).toLowerCase() === extname.toLowerCase())
            return baseName.substring(0, baseName.length - extname.length);
        return baseName;
    },

    /**
     * Get dirname of a file path.
     * @example
     * unix
     cc.path.driname("a/b/c.png");//-->"a/b"
     cc.path.driname("a/b/c.png?a=1&b=2");//-->"a/b"
     cc.path.dirname("a/b/");//-->"a/b"
     cc.path.dirname("c.png");//-->""
     * windows
     cc.path.driname("a\\b\\c.png");//-->"a\b"
     cc.path.driname("a\\b\\c.png?a=1&b=2");//-->"a\b"
     * @param {string} pathStr
     * @returns {*}
     */
    dirname: function (pathStr) {
        return pathStr.replace(/((.*)(\/|\\|\\\\))?(.*?\..*$)?/, '$2');
    },

    /**
     * Change extname of a file path.
     * @example
     cc.path.changeExtname("a/b.png", ".plist");//-->"a/b.plist"
     cc.path.changeExtname("a/b.png?a=1&b=2", ".plist");//-->"a/b.plist?a=1&b=2"
     * @param {string} pathStr
     * @param {string} [extname]
     * @returns {string}
     */
    changeExtname: function (pathStr, extname) {
        extname = extname || "";
        var index = pathStr.indexOf("?");
        var tempStr = "";
        if (index > 0) {
            tempStr = pathStr.substring(index);
            pathStr = pathStr.substring(0, index);
        }
        index = pathStr.lastIndexOf(".");
        if (index < 0) return pathStr + extname + tempStr;
        return pathStr.substring(0, index) + extname + tempStr;
    },
    /**
     * Change file name of a file path.
     * @example
     cc.path.changeBasename("a/b/c.plist", "b.plist");//-->"a/b/b.plist"
     cc.path.changeBasename("a/b/c.plist?a=1&b=2", "b.plist");//-->"a/b/b.plist?a=1&b=2"
     cc.path.changeBasename("a/b/c.plist", ".png");//-->"a/b/c.png"
     cc.path.changeBasename("a/b/c.plist", "b");//-->"a/b/b"
     cc.path.changeBasename("a/b/c.plist", "b", true);//-->"a/b/b.plist"
     * @param {String} pathStr
     * @param {String} basename
     * @param {Boolean} [isSameExt]
     * @returns {string}
     */
    changeBasename: function (pathStr, basename, isSameExt) {
        if (basename.indexOf(".") === 0) return this.changeExtname(pathStr, basename);
        var index = pathStr.indexOf("?");
        var tempStr = "";
        var ext = isSameExt ? this.extname(pathStr) : "";
        if (index > 0) {
            tempStr = pathStr.substring(index);
            pathStr = pathStr.substring(0, index);
        }
        index = pathStr.lastIndexOf("/");
        index = index <= 0 ? 0 : index + 1;
        return pathStr.substring(0, index) + basename + ext + tempStr;
    },
    //todo make public after verification
    _normalize: function (url) {
        var oldUrl = url = String(url);

        //removing all ../
        do {
            oldUrl = url;
            url = url.replace(this.normalizeRE, "");
        } while (oldUrl.length !== url.length);
        return url;
    }
};
//+++++++++++++++++++++++++something about path end++++++++++++++++++++++++++++++++

//+++++++++++++++++++++++++something about loader start+++++++++++++++++++++++++++
/**
 * Resource loading management. Created by in CCBoot.js as a singleton
 * cc.loader.
 * @name cc.Loader
 * @class
 * @memberof cc
 * @see cc.loader
 */

var imagePool = {
    _pool: new Array(10),
    _MAX: 10,
    _smallImg: "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=",

    count: 0,
    get: function () {
        if (this.count > 0) {
            this.count--;
            var result = this._pool[this.count];
            this._pool[this.count] = null;
            return result;
        }
        else {
            return new Image();
        }
    },
    put: function (img) {
        var pool = this._pool;
        if (img instanceof HTMLImageElement && this.count < this._MAX) {
            img.src = this._smallImg;
            pool[this.count] = img;
            this.count++;
        }
    }
};

/**
 * Singleton instance of cc.Loader.
 * @name cc.loader
 * @member {cc.Loader}
 * @memberof cc
 */
cc.loader = (function () {
    var _jsCache = {}, //cache for js
        _register = {}, //register of loaders
        _langPathCache = {}, //cache for lang path
        _aliases = {}, //aliases for res url
        _queue = {}, // Callback queue for resources already loading
        _urlRegExp = new RegExp("^(?:https?|ftp)://\\S*$", "i");

    return /** @lends cc.Loader# */{
        /**
         * Root path of resources.
         * @type {String}
         */
        resPath: "",

        /**
         * Root path of audio resources
         * @type {String}
         */
        audioPath: "",

        /**
         * Cache for data loaded.
         * @type {Object}
         */
        cache: {},

        /**
         * Get XMLHttpRequest.
         * @returns {XMLHttpRequest}
         */
        getXMLHttpRequest: function () {
            var xhr = window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject("MSXML2.XMLHTTP");
            xhr.timeout = 10000;
            if (xhr.ontimeout === undefined) {
                xhr._timeoutId = -1;
            }
            return xhr;
        },

        //@MODE_BEGIN DEV

        _getArgs4Js: function (args) {
            var a0 = args[0], a1 = args[1], a2 = args[2], results = ["", null, null];

            if (args.length === 1) {
                results[1] = a0 instanceof Array ? a0 : [a0];
            } else if (args.length === 2) {
                if (typeof a1 === "function") {
                    results[1] = a0 instanceof Array ? a0 : [a0];
                    results[2] = a1;
                } else {
                    results[0] = a0 || "";
                    results[1] = a1 instanceof Array ? a1 : [a1];
                }
            } else if (args.length === 3) {
                results[0] = a0 || "";
                results[1] = a1 instanceof Array ? a1 : [a1];
                results[2] = a2;
            } else throw new Error("arguments error to load js!");
            return results;
        },

        isLoading: function (url) {
            return (_queue[url] !== undefined);
        },

        /**
         * Load js files.
         * If the third parameter doesn't exist, then the baseDir turns to be "".
         *
         * @param {string} [baseDir]   The pre path for jsList or the list of js path.
         * @param {array} jsList    List of js path.
         * @param {function} [cb]  Callback function
         * @returns {*}
         */
        loadJs: function (baseDir, jsList, cb) {
            var self = this,
                args = self._getArgs4Js(arguments);

            var preDir = args[0], list = args[1], callback = args[2];
            if (navigator.userAgent.indexOf("Trident/5") > -1) {
                self._loadJs4Dependency(preDir, list, 0, callback);
            } else {
                cc.async.map(list, function (item, index, cb1) {
                    var jsPath = cc.path.join(preDir, item);
                    if (_jsCache[jsPath]) return cb1(null);
                    self._createScript(jsPath, false, cb1);
                }, callback);
            }
        },
        /**
         * Load js width loading image.
         *
         * @param {string} [baseDir]
         * @param {array} jsList
         * @param {function} [cb]
         */
        loadJsWithImg: function (baseDir, jsList, cb) {
            var self = this, jsLoadingImg = self._loadJsImg(),
                args = self._getArgs4Js(arguments);
            this.loadJs(args[0], args[1], function (err) {
                if (err) throw new Error(err);
                jsLoadingImg.parentNode.removeChild(jsLoadingImg);//remove loading gif
                if (args[2]) args[2]();
            });
        },
        _createScript: function (jsPath, isAsync, cb) {
            var d = document, self = this, s = document.createElement('script');
            s.async = isAsync;
            _jsCache[jsPath] = true;

                s.src = jsPath;

            s.addEventListener('load', function () {
              //  s.parentNode.removeChild(s);
                this.removeEventListener('load', arguments.callee, false);
                cb();
            }, false);
            s.addEventListener('error', function () {
                s.parentNode.removeChild(s);
                cb("Load " + jsPath + " failed!");
            }, false);
            d.body.appendChild(s);
        },
        _loadJs4Dependency: function (baseDir, jsList, index, cb) {
            if (index >= jsList.length) {
                if (cb) cb();
                return;
            }
            var self = this;
            self._createScript(cc.path.join(baseDir, jsList[index]), false, function (err) {
                if (err) return cb(err);
                self._loadJs4Dependency(baseDir, jsList, index + 1, cb);
            });
        },
        _loadJsImg: function () {
            var d = document, jsLoadingImg = d.getElementById("cocos2d_loadJsImg");
            if (!jsLoadingImg) {
                jsLoadingImg = document.createElement('img');

                if (cc._loadingImage)
                    jsLoadingImg.src = cc._loadingImage;

                var canvasNode = d.getElementById(cc.game.config["id"]);
                canvasNode.style.backgroundColor = "transparent";
                canvasNode.parentNode.appendChild(jsLoadingImg);

                var canvasStyle = getComputedStyle ? getComputedStyle(canvasNode) : canvasNode.currentStyle;
                if (!canvasStyle)
                    canvasStyle = {width: canvasNode.width, height: canvasNode.height};
                jsLoadingImg.style.left = canvasNode.offsetLeft + (parseFloat(canvasStyle.width) - jsLoadingImg.width) / 2 + "px";
                jsLoadingImg.style.top = canvasNode.offsetTop + (parseFloat(canvasStyle.height) - jsLoadingImg.height) / 2 + "px";
                jsLoadingImg.style.position = "absolute";
            }
            return jsLoadingImg;
        },
        //@MODE_END DEV

        /**
         * Load a single resource as txt.
         * @param {string} url
         * @param {function} [cb] arguments are : err, txt
         */
        loadTxt: function (url, cb) {
            if (!cc._isNodeJs) {
                var xhr = this.getXMLHttpRequest(),
                    errInfo = "load " + url + " failed!";
                xhr.open("GET", url, true);
                if (/msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent)) {
                    // IE-specific logic here
                    xhr.setRequestHeader("Accept-Charset", "utf-8");
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4)
                            (xhr.status === 200||xhr.status === 0) ? cb(null, xhr.responseText) : cb({status:xhr.status, errorMessage:errInfo}, null);
                    };
                } else {
                    if (xhr.overrideMimeType) xhr.overrideMimeType("text\/plain; charset=utf-8");
                    var loadCallback = function () {
                        xhr.removeEventListener('load', loadCallback);
                        xhr.removeEventListener('error', errorCallback);
                        if (xhr._timeoutId >= 0) {
                            clearTimeout(xhr._timeoutId);
                        }
                        else {
                            xhr.removeEventListener('timeout', timeoutCallback);
                        }
                        if (xhr.readyState === 4) {
                            (xhr.status === 200||xhr.status === 0) ? cb(null, xhr.responseText) : cb({status:xhr.status, errorMessage:errInfo}, null);
                        }
                    };
                    var errorCallback = function () {
                        xhr.removeEventListener('load', loadCallback);
                        xhr.removeEventListener('error', errorCallback);
                        if (xhr._timeoutId >= 0) {
                            clearTimeout(xhr._timeoutId);
                        }
                        else {
                            xhr.removeEventListener('timeout', timeoutCallback);
                        }
                        cb({status: xhr.status, errorMessage: errInfo}, null);
                    };
                    var timeoutCallback = function () {
                        xhr.removeEventListener('load', loadCallback);
                        xhr.removeEventListener('error', errorCallback);
                        if (xhr._timeoutId >= 0) {
                            clearTimeout(xhr._timeoutId);
                        }
                        else {
                            xhr.removeEventListener('timeout', timeoutCallback);
                        }
                        cb({status: xhr.status, errorMessage: "Request timeout: " + errInfo}, null);
                    };
                    xhr.addEventListener('load', loadCallback);
                    xhr.addEventListener('error', errorCallback);
                    if (xhr.ontimeout === undefined) {
                        xhr._timeoutId = setTimeout(function () {
                            timeoutCallback();
                        }, xhr.timeout);
                    }
                    else {
                        xhr.addEventListener('timeout', timeoutCallback);
                    }
                }
                xhr.send(null);
            } else {
                var fs = require("fs");
                fs.readFile(url, function (err, data) {
                    err ? cb(err) : cb(null, data.toString());
                });
            }
        },

        loadCsb: function(url, cb){
            var xhr = cc.loader.getXMLHttpRequest(),
                errInfo = "load " + url + " failed!";
            xhr.open("GET", url, true);
            xhr.responseType = "arraybuffer";

            var loadCallback = function () {
                xhr.removeEventListener('load', loadCallback);
                xhr.removeEventListener('error', errorCallback);
                if (xhr._timeoutId >= 0) {
                    clearTimeout(xhr._timeoutId);
                }
                else {
                    xhr.removeEventListener('timeout', timeoutCallback);
                }
                var arrayBuffer = xhr.response; // Note: not oReq.responseText
                if (arrayBuffer) {
                    window.msg = arrayBuffer;
                }
                if (xhr.readyState === 4) {
                    (xhr.status === 200||xhr.status === 0) ? cb(null, xhr.response) : cb({status:xhr.status, errorMessage:errInfo}, null);
                }
            };
            var errorCallback = function(){
                xhr.removeEventListener('load', loadCallback);
                xhr.removeEventListener('error', errorCallback);
                if (xhr._timeoutId >= 0) {
                    clearTimeout(xhr._timeoutId);
                }
                else {
                    xhr.removeEventListener('timeout', timeoutCallback);
                }
                cb({status:xhr.status, errorMessage:errInfo}, null);
            };
            var timeoutCallback = function () {
                xhr.removeEventListener('load', loadCallback);
                xhr.removeEventListener('error', errorCallback);
                if (xhr._timeoutId >= 0) {
                    clearTimeout(xhr._timeoutId);
                }
                else {
                    xhr.removeEventListener('timeout', timeoutCallback);
                }
                cb({status: xhr.status, errorMessage: "Request timeout: " + errInfo}, null);
            };
            xhr.addEventListener('load', loadCallback);
            xhr.addEventListener('error', errorCallback);
            if (xhr.ontimeout === undefined) {
                xhr._timeoutId = setTimeout(function () {
                    timeoutCallback();
                }, xhr.timeout);
            }
            else {
                xhr.addEventListener('timeout', timeoutCallback);
            }
            xhr.send(null);
        },

        /**
         * Load a single resource as json.
         * @param {string} url
         * @param {function} [cb] arguments are : err, json
         */
        loadJson: function (url, cb) {
            this.loadTxt(url, function (err, txt) {
                if (err) {
                    cb(err);
                }
                else {
                    try {
                        var result = JSON.parse(txt);
                    }
                    catch (e) {
                        throw new Error("parse json [" + url + "] failed : " + e);
                        return;
                    }
                    cb(null, result);
                }
            });
        },

        _checkIsImageURL: function (url) {
            var ext = /(\.png)|(\.jpg)|(\.bmp)|(\.jpeg)|(\.gif)/.exec(url);
            return (ext != null);
        },
        /**
         * Load a single image.
         * @param {!string} url
         * @param {object} [option]
         * @param {function} callback
         * @returns {Image}
         */
        loadImg: function (url, option, callback, img) {
            var opt = {
                isCrossOrigin: true
            };
            if (callback !== undefined)
                opt.isCrossOrigin = option.isCrossOrigin === undefined ? opt.isCrossOrigin : option.isCrossOrigin;
            else if (option !== undefined)
                callback = option;

            var texture = this.getRes(url);
            if (texture) {
                callback && callback(null, texture);
                return null;
            }

            var queue = _queue[url];
            if (queue) {
                queue.callbacks.push(callback);
                return queue.img;
            }

            img = img || imagePool.get();
            if (opt.isCrossOrigin && location.origin !== "file://")
                img.crossOrigin = "Anonymous";
            else
                img.crossOrigin = null;

            var loadCallback = function () {
                this.removeEventListener('load', loadCallback, false);
                this.removeEventListener('error', errorCallback, false);

                var queue = _queue[url];
                if (queue) {
                    var callbacks = queue.callbacks;
                    for (var i = 0; i < callbacks.length; ++i) {
                        var cb = callbacks[i];
                        if (cb) {
                            cb(null, img);
                        }
                    }
                    queue.img = null;
                    delete _queue[url];
                }

                if (window.ENABLE_IMAEG_POOL && cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
                    imagePool.put(img);
                }
            };

            var self = this;
            var errorCallback = function () {
                this.removeEventListener('load', loadCallback, false);
                this.removeEventListener('error', errorCallback, false);

                if (window.location.protocol !== 'https:' && img.crossOrigin && img.crossOrigin.toLowerCase() === "anonymous") {
                    opt.isCrossOrigin = false;
                    self.release(url);
                    cc.loader.loadImg(url, opt, callback, img);
                } else {
                    var queue = _queue[url];
                    if (queue) {
                        var callbacks = queue.callbacks;
                        for (var i = 0; i < callbacks.length; ++i) {
                            var cb = callbacks[i];
                            if (cb) {
                                cb("load image failed");
                            }
                        }
                        queue.img = null;
                        delete _queue[url];
                    }

                    if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
                        imagePool.put(img);
                    }
                }
            };

            _queue[url] = {
                img: img,
                callbacks: callback ? [callback] : []
            };

            img.addEventListener("load", loadCallback);
            img.addEventListener("error", errorCallback);
            img.src = url;
            return img;
        },

        /**
         * Iterator function to load res
         * @param {object} item
         * @param {number} index
         * @param {function} [cb]
         * @returns {*}
         * @private
         */
        _loadResIterator: function (item, index, cb) {
            var self = this, url = null;
            var type = item.type;
            if (type) {
                type = "." + type.toLowerCase();
                url = item.src ? item.src : item.name + type;
            } else {
                url = item;
                type = cc.path.extname(url);
            }

            var obj = self.getRes(url);
            if (obj)
                return cb(null, obj);
            var loader = null;
            if (type) {
                loader = _register[type.toLowerCase()];
            }
            if (!loader) {
                cc.error("loader for [" + type + "] doesn't exist!");
                return cb();
            }
            var realUrl = url;
            if (!_urlRegExp.test(url)) {
                var basePath = loader.getBasePath ? loader.getBasePath() : self.resPath;
                realUrl = self.getUrl(basePath, url);
            }

            if (cc.game.config["noCache"] && typeof realUrl === "string") {
                if (self._noCacheRex.test(realUrl))
                    realUrl += "&_t=" + (new Date() - 0);
                else
                    realUrl += "?_t=" + (new Date() - 0);
            }
            loader.load(realUrl, url, item, function (err, data) {
                if (err) {
                    cc.log(err);
                    self.cache[url] = null;
                    delete self.cache[url];
                    cb({status: 520, errorMessage: err}, null);
                } else {
                    self.cache[url] = data;
                    cb(null, data);
                }
            });
        },
        _noCacheRex: /\?/,

        /**
         * Get url with basePath.
         * @param {string} basePath
         * @param {string} [url]
         * @returns {*}
         */
        getUrl: function (basePath, url) {
            var self = this, path = cc.path;
            if (basePath !== undefined && url === undefined) {
                url = basePath;
                var type = path.extname(url);
                type = type ? type.toLowerCase() : "";
                var loader = _register[type];
                if (!loader)
                    basePath = self.resPath;
                else
                    basePath = loader.getBasePath ? loader.getBasePath() : self.resPath;
            }
            url = cc.path.join(basePath || "", url);
            if (url.match(/[\/(\\\\)]lang[\/(\\\\)]/i)) {
                if (_langPathCache[url])
                    return _langPathCache[url];
                var extname = path.extname(url) || "";
                url = _langPathCache[url] = url.substring(0, url.length - extname.length) + "_" + cc.sys.language + extname;
            }
            return url;
        },

        /**
         * Load resources then call the callback.
         * @param {string} resources
         * @param {function} [option] callback or trigger
         * @param {function|Object} [loadCallback]
         * @return {cc.AsyncPool}
         */
        load: function (resources, option, loadCallback) {
            var self = this;
            var len = arguments.length;
            if (len === 0)
                throw new Error("arguments error!");

            if (len === 3) {
                if (typeof option === "function") {
                    if (typeof loadCallback === "function")
                        option = {trigger: option, cb: loadCallback};
                    else
                        option = {cb: option, cbTarget: loadCallback};
                }
            } else if (len === 2) {
                if (typeof option === "function")
                    option = {cb: option};
            } else if (len === 1) {
                option = {};
            }

            if (!(resources instanceof Array))
                resources = [resources];
            var asyncPool = new cc.AsyncPool(
                resources, cc.CONCURRENCY_HTTP_REQUEST_COUNT,
                function (value, index, AsyncPoolCallback, aPool) {
                    self._loadResIterator(value, index, function (err) {
                        var arr = Array.prototype.slice.call(arguments, 1);
                        if (option.trigger)
                            option.trigger.call(option.triggerTarget, arr[0], aPool.size, aPool.finishedSize);   //call trigger
                        AsyncPoolCallback(err, arr[0]);
                    });
                },
                option.cb, option.cbTarget);
            asyncPool.flow();
            return asyncPool;
        },

        _handleAliases: function (fileNames, cb) {
            var self = this;
            var resList = [];
            for (var key in fileNames) {
                var value = fileNames[key];
                _aliases[key] = value;
                resList.push(value);
            }
            this.load(resList, cb);
        },

        /**
         * <p>
         *     Loads alias map from the contents of a filename.                                        <br/>
         *                                                                                                                 <br/>
         *     @note The plist file name should follow the format below:                                                   <br/>
         *     <?xml version="1.0" encoding="UTF-8"?>                                                                      <br/>
         *         <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">  <br/>
         *             <plist version="1.0">                                                                               <br/>
         *                 <dict>                                                                                          <br/>
         *                     <key>filenames</key>                                                                        <br/>
         *                     <dict>                                                                                      <br/>
         *                         <key>sounds/click.wav</key>                                                             <br/>
         *                         <string>sounds/click.caf</string>                                                       <br/>
         *                         <key>sounds/endgame.wav</key>                                                           <br/>
         *                         <string>sounds/endgame.caf</string>                                                     <br/>
         *                         <key>sounds/gem-0.wav</key>                                                             <br/>
         *                         <string>sounds/gem-0.caf</string>                                                       <br/>
         *                     </dict>                                                                                     <br/>
         *                     <key>metadata</key>                                                                         <br/>
         *                     <dict>                                                                                      <br/>
         *                         <key>version</key>                                                                      <br/>
         *                         <integer>1</integer>                                                                    <br/>
         *                     </dict>                                                                                     <br/>
         *                 </dict>                                                                                         <br/>
         *              </plist>                                                                                           <br/>
         * </p>
         * @param {String} url  The plist file name.
         * @param {Function} [callback]
         */
        loadAliases: function (url, callback) {
            var self = this, dict = self.getRes(url);
            if (!dict) {
                self.load(url, function (err, results) {
                    self._handleAliases(results[0]["filenames"], callback);
                });
            } else
                self._handleAliases(dict["filenames"], callback);
        },

        /**
         * Register a resource loader into loader.
         * @param {string} extNames
         * @param {function} loader
         */
        register: function (extNames, loader) {
            if (!extNames || !loader) return;
            var self = this;
            if (typeof extNames === "string")
                return _register[extNames.trim().toLowerCase()] = loader;
            for (var i = 0, li = extNames.length; i < li; i++) {
                _register["." + extNames[i].trim().toLowerCase()] = loader;
            }
        },

        /**
         * Get resource data by url.
         * @param url
         * @returns {*}
         */
        getRes: function (url) {
            return this.cache[url] || this.cache[_aliases[url]];
        },

        /**
         * Get aliase by url.
         * @param url
         * @returns {*}
         */
        _getAliase: function (url) {
            return _aliases[url];
        },

        /**
         * Release the cache of resource by url.
         * @param url
         */
        release: function (url) {
            var cache = this.cache;
            var queue = _queue[url];
            if (queue) {
                queue.img = null;
                delete _queue[url];
            }
            delete cache[url];
            delete cache[_aliases[url]];
            delete _aliases[url];
        },

        /**
         * Resource cache of all resources.
         */
        releaseAll: function () {
            var locCache = this.cache;
            for (var key in locCache)
                delete locCache[key];
            for (var key in _aliases)
                delete _aliases[key];
        }
    };
})();
//+++++++++++++++++++++++++something about loader end+++++++++++++++++++++++++++++

/**
 * A string tool to construct a string with format string.
 * for example:
 *      cc.formatStr("a: %d, b: %b", a, b);
 *      cc.formatStr(a, b, c);
 * @returns {String}
 */
cc.formatStr = function () {
    var args = arguments;
    var l = args.length;
    if (l < 1)
        return "";

    var str = args[0];
    var needToFormat = true;
    if (typeof str === "object") {
        needToFormat = false;
    }
    for (var i = 1; i < l; ++i) {
        var arg = args[i];
        if (needToFormat) {
            while (true) {
                var result = null;
                if (typeof arg === "number") {
                    result = str.match(/(%d)|(%s)/);
                    if (result) {
                        str = str.replace(/(%d)|(%s)/, arg);
                        break;
                    }
                }
                result = str.match(/%s/);
                if (result)
                    str = str.replace(/%s/, arg);
                else
                    str += "    " + arg;
                break;
            }
        } else
            str += "    " + arg;
    }
    return str;
};

cc.log=function (str) {
     var timestamp=new Date().toISOString();
    console.log(timestamp.substr(timestamp.length-13,13)+"--"+ str);
}

cc.isEmpty=function (ob) {
    if(ob==undefined) return true;
    if(ob==null) return true;
    if(ob.toString()=='') return true;
    return false;
}

//cc event prototype
cc.Class.prototype.addCEventListener=function(event,func,caller){
    if (this.arrEventCb==null) this.arrEventCb=[];
    var f=false;
    for(var i=0;i<this.arrEventCb.length;i++){
        if (this.arrEventCb[i].ev==event && this.arrEventCb[i].cb==func && this.arrEventCb[i].caller==caller) {
            f=true;
            break;
        }
    }
    if (!f) this.arrEventCb.push({ev:event,cb:func,caller:caller});
};

cc.Class.prototype.removeCEventListener=function(event,func,caller){
    if (this.arrEventCb==null) this.arrEventCb=[];
    var f=false;
    for(var i=0;i<this.arrEventCb.length;i++){
        if (this.arrEventCb[i].ev==event && this.arrEventCb[i].cb==func && caller==this.arrEventCb[i].caller) {
            f=true;
            this.arrEventCb.splice(i,1);
            break;
        }
    }
};

cc.Class.prototype.CEventCallback=function(event){
    if (this.arrEventCb==null) return;
    var arrCall=this.arrEventCb.concat();
    for(var i=0;i<arrCall.length;i++){
        if (arrCall[i].ev==event){

            arrCall[i].cb.apply(arrCall[i].caller,arguments);
        }
    }
};

cc.Class.prototype.removeAllCEventListener=function(event){
    if (event==null) {
        if (this.arrEventCb == null) return;
        this.arrEventCb = [];
    }else{
        if (this.arrEventCb == null || this.arrEventCb==undefined) return;
        var foundEv=false;
        do{
            foundEv=false;
            for(var i=0;i<this.arrEventCb.length;i++){
                if (this.arrEventCb[i].ev==event){
                    this.arrEventCb.splice(i,1);
                    foundEv=true;
                    break;
                }
            }
        }while(foundEv)
    }
};

cc.isEmpty=function (ob) {
    if(ob==null) return true;
    if(ob==undefined) return true;
    if(ob.toString()=='') return true;
    return false;
}
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
