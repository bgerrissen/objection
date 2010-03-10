/**
 * Object toolkit 'Objection'
 * 
 * @author Ben Gerrissen http://www.netben.nl/ bgerrissen@gmail.com
 * @license MIT
 * @release March 8th, 2010
 * 
 * 
 * @version 1.0
 * 
 */
(function(global){
    
    
    var slice = Array.prototype.slice,
        Factory = {
            initialise: function(){
                this._target = {};
                this._types = {};
            },
            create: function(type, properties){
                if(type && !this._types[type]) {
                    throw new TypeError();
                }
                return type ? api.create(this._types[type], properties, true) : api.create(this._target, properties, true);
            },
            addType: function(type, properties){
                if(type && properties){
                    this._types[type] = api.create(this._target, properties, true);
                }
                return this;
            },
            removeType: function(type){
                delete this._types[type];
                return this;
            },
            clear: function(){
                this._types = {};
                return this;
            }
        },
        Adapter = {
            initialise: function(){
                this._target = {};
            }
        };
        
    var createAdapterMethod = function(method, adapter){
        return function(){
            var result = method.apply(this._target, arguments);
            return result === this._target ? adapter : result;
        }
    }
    
    var a = {i:1}, b = {__proto__:a}, empty = function(){};
    
    var create = Object.create ? Object.create : b.i ? function(obj, properties){
        return properties ? api.augment({__proto__:obj}, properties, true) : {__proto__:obj};
    } : function(obj, properties){
        empty.prototype = obj;
        obj = new empty();
        return properties ? api.augment(obj, properties, true) : obj;
    }
    
    var api = {
        
        augment: function(obj, provider, override){
            if(!provider || !obj) {
                return obj;
            }
            for(var property in provider) {
                if(!obj[property] || override) {
                    obj[property] = provider[property];
                }
            }
            return obj;
        },
        
        create: function(obj, properties){
            obj = create(obj, properties);
            obj.initialise && obj.initialise();
            obj.initialize && obj.initialize(); // for the yanks...
            return obj;
        },
        
        factory: function(obj, type, properties){
            var factory = api.create(Factory);
            factory._target = obj;
            if (type && properties) {
                factory._types[type] = api.create(obj, properties, true);
            }
            return factory;
        },
        
        adapter: function(obj, map){
            var adapter = api.create(Adapter);
            for(var method in map) {
                if (typeof map[method] === 'string') {
                    if(typeof obj[map[method]] !== 'function') {
                        throw new TypeError();
                    }
                    adapter[method] = createAdapterMethod(obj[map[method]], adapter);
                } else if(typeof map[method] === 'function') {
                    adapter[method] = createAdapterMethod(map[method], adapter);
                }
            }
            adapter._target = obj;
            return adapter;
        },
        
        // possibly make #is, #isSome and #isAll work with constructor functions as well?
        
        is: function(object, target){
            if(!target || !('isPrototypeOf' in target)) {
                throw new TypeError();
            }
            return target.isPrototypeOf(object) || target === object;
        },
        
        isSome: function(object /*, targets */){
            var list = slice.call(arguments, 1),
                i = list.length;
            while(i--) {
                if(!('isPrototypeOf' in list[i])) {
                    throw new TypeError();
                }
                if(list[i].isPrototypeOf(object) || list[i] === object) {
                    return true;
                }
            }
            return false;
        },
        
        isAll: function(object /*, targets */){
            var list = slice.call(arguments, 1),
                i = list.length;
            while(i--) {
                if(!('isPrototypeOf' in list[i])) {
                    throw new TypeError();
                }
                if(!list[i].isPrototypeOf(object) && list[i] !== object) {
                    return false;
                }
            }
            return true;
        }
        
    };
    
    api = api.augment(api.create, api, true);
    
    global.Objection = api;
    global.Obj || (global.Obj = api);
    
}(window||this));