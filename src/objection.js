/**
 * @author Ben
 */
(function(global){
    
    
    var slice = Array.prototype.slice,
        Factory = {},
        Adapter = {};
        
    var createAdapterMethod = function(method, adapter){
        return function(){
            var result = method.apply(this._adaptedObject, arguments);
            return result === this._adaptedObject ? adapter : result;
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
            if(Adapter.isPrototypeOf(obj)){
                obj = create(obj);
                obj._adaptedObject = create(obj._adaptedObject, properties);
            } else if (Factory.isPrototypeOf(obj)){
                obj = create(obj, properties);
                obj._types = api.augment({}, obj._types);
            } else {
                obj = create(obj, properties);
            }
            obj.initialise && obj.initialise();
            return obj;
        },
        
        factory: function(obj, type, properties){
            var types = {};
            if (type && properties) {
                types[type] = api.create(obj, properties, true);
            }
            return {
                create: function(type, properties){
                    if(type && !types[type]) {
                        throw new TypeError();
                    }
                    return type ? api.create(types[type], properties, true) : api.create(obj, properties, true);
                },
                addType: function(type, properties){
                    if(type && properties){
                        types[type] = api.create(obj, properties, true);
                    }
                    return this;
                },
                removeType: function(type){
                    delete types[type];
                    return this;
                },
                clear: function(){
                    types = {};
                    return this;
                },
                _types: types
            };
        },
        
        adapter: function(obj, map){
            if(Adapter.isPrototypeOf(obj)) {
                throw new TypeError();
            }
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
            adapter._adaptedObject = obj;
            return adapter;
        },
        
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
        },
        
        toClass: function(obj, init){
            init || (init = obj.initialise || function(){});
            init.prototype = create(obj);
            return init;
        }
        
    };
    
    api = api.augment(api.create, api, true);
    
    global.Objection = api;
    global.Obj || (global.Obj = api);
    
}(window||this));