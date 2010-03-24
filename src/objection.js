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
            constructor: function(){
                this._target = {};
                this._types = {};
            },
            create: function(type, properties){
                if(type && !this._types[type]) {
                    throw new TypeError();
                }
                return type ? createInstance(this._types[type], properties) : createInstance(this._target, properties);
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
            constructor: function(){
                this._target = {};
            }
        },
        
    	adapterMethod = function(method, adapter){
	        return function(){
	            var result = method.apply(this._target, arguments);
	            return result === this._target ? adapter : result;
	        }
	    },
		
		Obj = function(obj, properties){
			obj = api.create(obj, properties);
			obj.constructor && obj.constructor();
			return obj;
		},
		
		api = {
        
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
	        
	        create: Object.create ? Object.create : '__proto__' in {} ? function(obj, properties){
		        return properties ? api.augment({__proto__:obj}, properties, 1) : {__proto__:obj};
		    } : function(obj, properties){
		        empty.prototype = obj;
		        obj = new empty();
		        return properties ? api.augment(obj, properties, 1) : obj;
		    },
	        
	        factory: function(obj, type, properties){
	            var factory = Obj(Factory);
	            factory._target = obj;
	            if (type && properties) {
	                factory._types[type] = api.create(obj, properties);
	            }
	            return factory;
	        },
	        
	        adapter: function(obj, map){
	            var adapter = Obj(Adapter);
	            for(var method in map) {
	                if (typeof map[method] === 'string') {
	                    if(typeof obj[map[method]] !== 'function') {
	                        throw new TypeError();
	                    }
	                    adapter[method] = adapterMethod(obj[map[method]], adapter);
	                } else if(typeof map[method] === 'function') {
	                    adapter[method] = adapterMethod(map[method], adapter);
	                }
	            }
	            adapter._target = obj;
	            return adapter;
	        },
	        
	        is: function(obj, target){
				typeof target === 'function' && (target = target.prototype);
	            return target.isPrototypeOf(obj) || target === obj;
	        },
			
			owns: function(obj, property){
				return obj.hasOwnProperty(property);
			},
			
			has: function(obj, property){
				return !!obj[property];
			}
	        
	    };
	
	(function(){
		
		function expect(method, exp){
			return function(obj /*, candidates*/){
				var list = slice.call(arguments, 1),
					i = list.length;
				while(i--){
					if(method(obj, list[i]) === exp) {
						return exp;
					}
				}
				return !exp;
			}
		}
		
		var someAll = 'is owns has'.split(/ /),
			cur;
			
		while((cur = someAll.pop())){
			api[cur+'All'] = expect(api[cur], false);
			api[cur+'Some'] = expect(api[cur], true);
		}
		
	}());
	
	
    
    api.augment(Obj, api, true);
    
    global.Objection = Obj;
    global.Obj || (global.Obj = Obj);
    
}(this));