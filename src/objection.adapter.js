Objection.store( "adapter" , {

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
    
});