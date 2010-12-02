/**@factory 	An object that stores a blueprint object and any number of 
 * 				decorators.
 * @constructor Adds two owned properties to the factory object:
 * 				- _blueprint A clone of the original object
 * 				- _types Collection of decorators
 * 
 */
Objection.store( "factory" , {

	constructor: function( obj , properties ) {

		this._blueprint = Obj.clone( obj , properties );
		this._types = {};
        
	},

	create: function(type /* arguments */){
		(type && (type = this._types[type])) || (type = this._blueprint);
		var args = [type].concat(Array.prototype.slice.call(arguments, 1));
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
});