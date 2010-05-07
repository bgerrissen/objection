/*
 * Object toolkit 'Objection'
 * 
 * @author Ben Gerrissen http://www.netben.nl/ bgerrissen@gmail.com
 * @license MIT
 * @release
 * 		v1.2
 * 			- Obj()/Objection(), #augment and #clone can also accept a id string instead of a stored (#store) object.
 * 			- added: #store
 * 			- moved prototype patterns: Factory, Adapter, Publisher, Command to seperate files.
 * 		v1.1
 * 			- Obj()/Objection() now acts as a constructor (objects constructor method is called after cloning)
 * 			- new static methods: #keys, #values, #each, #isSome, #isAll, #has, #hasAll, #hasSome, #owns, #ownsSome, #ownsAll
 * 			- renamed: #create to #clone
 * 			- removed: #factory in favor of prototype pattern
 * 			- removed: #adapter in favor of prototype pattern
 * 			- added prototype patterns: #Factory, #Adapter, #Publisher, #Command
 * 		v1.0 March 8th, 2010
 * 
 * 
 * @version 1.2
 * 
 */
(function(global){
    
    
    var slice = Array.prototype.slice, empty = function(){};
    
    var registry = {}, cache = {};
    
    var checkOut = function(name){
    	if(!registry[name]) throw 'No reference found: ' + name;
    	return registry[name];
    }
    
    var checkIn = function(name, obj){
    	if(registry[name]) throw 'Object already defined: ' + name;
    	registry[name] = obj;
    }
	
	Obj = function(obj /*, arguments */){
		typeof obj === 'string' && (obj = checkOut(obj));
		typeof obj === 'function' && (obj.prototype.constructor = obj) && ((obj.prototype.constructor = obj) && (obj = obj.prototype));
		obj = Obj.clone(obj);
		obj.constructor && (arguments.length > 1) ? obj.constructor.apply(obj, slice.call(arguments, 1)): obj.constructor();
		return obj;
	}
	
	Obj.augment = function(obj, provider, override){
        if(!provider || !obj) {
            return obj;
        }
        typeof obj === 'string' && (obj = checkOut(obj));
        for(var property in provider) {
            if(!obj[property] || override) {
                obj[property] = provider[property];
            }
        }
        return obj;
    }
	
	Obj.augment(Obj, {
		
        clone: ('__proto__' in {} ? function(obj, properties){
        	typeof obj === 'string' && (obj = checkOut(obj));
	        return properties ? Obj.augment({__proto__:obj}, properties, 1) : {__proto__:obj};
	    } : function(obj, properties){
	    	typeof obj === 'string' && (obj = checkOut(obj));
			!obj.__proto__ && obj.constructor && (obj.__proto__ = obj.constructor.prototype);
	        empty.prototype = obj;
	        obj = new empty();
			obj.__proto__ = empty.prototype;
	        return properties ? Obj.augment(obj, properties, 1) : obj;
	    }),
	    
	    construct: Obj,
	    
	    store: function(namespace, from, properties){
			from = (from && properties) ? Obj.clone(from, properties) : Obj.clone(from);
			from.oType = namespace.split('.').pop();
			checkIn(namespace, from);
			return this;
		},
	    
        is: function(obj, target){
			typeof obj === 'string' && target === String && (target = obj);
			typeof target === 'function' && (target = target.prototype);
            return target === obj || target.isPrototypeOf(obj);
        },
		
		owns: function(obj, property){
			return obj.hasOwnProperty(property);
		},
		
		has: function(obj, property){
			return !!obj[property];
		},
		
		each: function(obj, handler, all){
			for(var key in obj){
				(all || Obj.owns(obj, key)) && handler.call(obj, key, obj[key]);
			}
			return this;
		},
		
		keys: function(obj, all){
			var result = [];
			for(var key in obj){
				(all || Obj.owns(obj, key)) && result.push(key);
			}
			return result;
		},
		
		values: function(obj, all){
			var result = [];
			for(var key in obj){
				(all || Obj.owns(obj, key)) && result.push(obj[key]);
			}
			return result;
		}
        
    });
		
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
		Obj[cur+'All'] = expect(Obj[cur], 0);
		Obj[cur+'Some'] = expect(Obj[cur], 1);
	}
	
	Obj.lib = registry;
    
    global.Objection = Obj;
    global.Obj || (global.Obj = Obj);
    
}(this));