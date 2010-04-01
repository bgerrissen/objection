/*
 * Object toolkit 'Objection'
 * 
 * @author Ben Gerrissen http://www.netben.nl/ bgerrissen@gmail.com
 * @license MIT
 * @release 
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
 * @version 1.0
 * 
 */
(function(global){
    
    
    var slice = Array.prototype.slice, empty = function(){}
	
	Obj = function(obj /*, arguments */){
		typeof obj === 'function' && (obj.prototype.constructor = obj) && (obj = obj.prototype);
		obj = Obj.clone(obj);
		obj.constructor && (arguments.length > 1) ? obj.constructor.apply(obj, slice.call(arguments, 1)): obj.constructor();
		return obj;
	}
	
	Obj.augment = function(obj, provider, override){
        if(!provider || !obj) {
            return obj;
        }
        for(var property in provider) {
            if(!obj[property] || override) {
                obj[property] = provider[property];
            }
        }
        return obj;
    }
	
	Obj.augment(Obj, {
		
        clone: ('__proto__' in {} ? function(obj, properties){
	        return properties ? Obj.augment({__proto__:obj}, properties, 1) : {__proto__:obj};
	    } : function(obj, properties){
			!obj.__proto__ && obj.constructor && (obj.__proto__ = obj.constructor.prototype);
	        empty.prototype = obj;
	        obj = new empty();
			obj.__proto__ = empty.prototype;
	        return properties ? Obj.augment(obj, properties, 1) : obj;
	    }),
        
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
		
		each: function(obj, handler){
			for(var key in obj){
				Obj.owns(obj, key) && handler.call(obj, key, obj[key]);
			}
			return this;
		},
		
		keys: function(obj){
			var result = [];
			for(var key in obj){
				Obj.owns(obj, key) && result.push(key);
			}
			return result;
		},
		
		values: function(obj){
			var result = [];
			for(var key in obj){
				Obj.owns(obj, key) && result.push(obj[key]);
			}
			return result;
		},
		
		/* pondering moving below patterns out of objection */
		Factory: {
			constructor: function(obj, properties){
				this._blueprint = Obj.clone(obj, properties);
            	this._types = {};
			},
			create: function(type /* arguments */){
				(type && (type = this._types[type])) || (type = this._blueprint);
				var args = [type].concat(slice.call(arguments, 1));
                return Obj.apply(null, args);
            },
            addType: function(type, properties){
                type && properties && (this._types[type] = Obj.clone(this._blueprint, properties));
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
		
		Adapter: {
			constructor: function(obj, map){
				this._adaptedObject && (this._adaptedObject = Obj.clone(this._adaptedObject));
				!this._adaptedObject && (this._adaptedObject = obj || {});
				for(var method in map){
					typeof map[method] === 'string' && !obj[map[method]] && (this[method] = 'method missing: ' + map[method]);
					typeof map[method] === 'string' && (this[method] = this._adaptMethod(obj[map[method]]));
					typeof map[method] === 'function' && (this[method] = this._adaptMethod(map[method]));
				}
			},
			_adaptMethod: function(method){
				function adapterMethod(){
		            var result = method.apply(this._adaptedObject, arguments);
		            return result === this._adaptedObject ? this : result;
		        }
				return adapterMethod;
			}
		},
		
		Publisher: {
			constructor: function(){
				this._subscribers = {};
				this.Event = Obj.clone(this.Event);
			},
			subscribe: function(event, subscriber){
				return (this._subscribers[event] || (this._subscribers[event] = [])).unshift(subscriber), this;
			},
			unsubscribe: function(event, subscriber){
				var list = this._subscribers[event]||(this._subscribers[event] = []),
					i = list.length;
				while(i--){
					list[i] === subscriber && list.splice(i, 1);
				}
				return this;
			},
			publish: function(event, data){
				data = Obj.is(data, this.Event) ? data : Obj(this.Event, event, data, this);
				data.currentTarget = this;
				var list = this._subscribers[event]||(this._subscribers[event] = []),
					i = list.length;
				while(i--){
					data.currentHandler = list[i];
					typeof list[i] === 'function' && list[i].call(this,data);
					list[i] && typeof list[i][event] === 'function'  && list[i][event](data);
					if(event.stopped) break;
				}
				return this;
			},
			Event: {
				constructor: function(event, data, target){
					this.type = event;
					this.target = target;
					Obj.augment(this, data, true);
				},
				remove: function(){
					this.currentTarget.unsubscribe(this.type, this.currentHandler);
				},
				stop: function(){
					this.stopped = true;
				}
			}
		},
		
		Command: {
			constructor: function(descriptors){
				this._commands = [];
				if(descriptors){
					for(var i=0, len = arguments.length;i<len;i++){
						this.add(arguments[i]);
					}
				}
			},
			/* descriptor: {
			 * 		object: AnObject,
			 * 		method: 'methodName',
			 * 		args: ['arg1', 'arg2', 'arg3'],
			 * 		params: [null, 1, null]
			 * }
			 * 
			 * */
			add: function(descriptor){
				this._commands.push(descriptor);
				return this;
			},
			
			addBefore: function(obj, method, descriptor){
				var list = this._commands,
					i = list.length;
				while(i--){
					if(list[i].object === obj && list[i].method === method){
						list.splice(i, 0, descriptor);
						break;
					}
				}
				return this;
			},
			
			addAfter: function(obj, method, descriptor){
				var list = this._commands,
					i = list.length;
				while(i--){
					if(list[i].object === obj && list[i].method === method){
						list.splice(i+1, 0, descriptor);
						break;
					}
				}
				return this;
			},
			
			remove: function(obj, method){
				var list = this._commands,
					i = list.length;
				while(i--){
					list[i].object === obj && list[i].method === method && list.splice(i, 1);
				}
				return this;
			},
			
			exec: function(parms){
				var list = this._commands,
					len = list.length,
					obj, args;
				for(var i = 0;i<len;i++){
					args = parms ? this._args(list[i], parms) : list[i].parms || [];
					(obj = list[i].object) && obj[list[i].method].apply(obj, args);
				}
			},
			
			_args: function(desc, parms){
				var args = [];
				if(desc.args && desc.params){
					for(var i=desc.args.length, c;c = desc.args[--i];){
						args[i] = parms[c] ? parms[c] : desc.params[i];
					}
				}
				return args;
			}
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
		Obj[cur+'All'] = expect(Obj[cur], false);
		Obj[cur+'Some'] = expect(Obj[cur], true);
	}
    
    global.Objection = Obj;
    global.Obj || (global.Obj = Obj);
    
}(this));