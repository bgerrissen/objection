Objection.store('command', {
	
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
	 * 		args: ['arg1', 'arg2', 'arg3'], // argument names
	 * 		params: [null, 1, null] // default argument values
	 * }
	 * 
	 * */
	add: function(descriptor){
		this._commands.push(descriptor);
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
	
	run: function(parms){
		var list = this._commands,
			len = list.length,
			obj, args;
		for(var i = 0;i<len;i++){
			args = parms ? this._interpolateArguments(list[i], parms) : list[i].parms || [];
			(obj = list[i].object) && obj[list[i].method].apply(obj, args);
		}
	},
	
	_interpolateArguments: function(desc, parms){
		var args = [];
		if(desc.args && desc.params){
			for(var i=desc.args.length, c;c = desc.args[--i];){
				args[i] = parms[c] ? parms[c] : desc.params[i];
			}
		}
		return args;
	}
});