/*
 * Object toolkit 'Objection'
 * 
 * @author Ben Gerrissen http://www.netben.nl/ bgerrissen@gmail.com
 * @license MIT
 * @release
 * 
 *      v1.3
 *          - Removed premature optimalisation from source
 *          - #isAll, #hasAll, #isSome, #hasSome, #ownsSome, ownsAll now return proper boolean values
 *          - new static methods: #type
 *
 * 		v1.2
 * 			- Obj()/Objection(), #augment and #clone can also accept a id string instead of a stored (#store) object.
 * 			- added: #store
 * 			- moved prototype patterns: Factory, Adapter, Publisher, Command to seperate files.
 *
 * 		v1.1
 * 			- Obj()/Objection() now acts as a constructor (objects constructor method is called after cloning)
 * 			- new static methods: #keys, #values, #each, #isSome, #isAll, #has, #hasAll, #hasSome, #owns, #ownsSome, #ownsAll
 * 			- renamed: #create to #clone
 * 			- removed: #factory in favor of prototype pattern
 * 			- removed: #adapter in favor of prototype pattern
 * 			- added prototype patterns: #Factory, #Adapter, #Publisher, #Command
 * 
 * 		v1.0 March 8th, 2010
 * 
 * 
 * @version 1.2
 * 
 */
(function(global){
    
    
    var slice = Array.prototype.slice
    , toTypeString = Object.prototype.toString
    , empty = function(){}
    , registry = {}
    
    , checkOut = function ( name ) {

    	if ( !registry[ name ] ) {

            throw "No reference found for: '" + name + "'";

        }

    	return registry[ name ];

    }
    
    , checkIn = function ( name , obj ) {

    	if ( registry[ name ] ) {

            throw "Another Object is already stored under name: '" + name + "'";

        }

    	registry[ name ] = obj;

    }

    , touch = function ( obj ) {

        if ( typeof obj === "string" ) {

            return checkOut( obj );

        }

        return obj;

    }

    , Obj = function ( obj /* [ , arguments ] */ ) {

        obj = touch( obj );

        if ( typeof obj === "function" ) {

            obj.prototype.constructor = obj;
            obj = obj.prototype;

        }

        obj = clone( obj );

        if ( obj.constructor ) {

            obj.constructor.apply( obj , slice.call( arguments , 1 ) );

        }

        return obj;

    }

    , augment = Obj.augment = function ( obj , provider , override ) {

        if ( !provider || !obj ) {

            return obj;

        }

        obj = touch( obj );

        for ( var property in provider ) {

            if ( !obj[ property ] || override ) {

                obj[ property ] = provider[ property ];

            }

        }

        return obj;

    }

    , clone = Obj.clone = ( "__proto__" in {} ) ? function ( obj , properties ) {

        obj = touch( obj );
        obj = {
            __proto__ : obj
        };

        return augment( obj , properties , true );

    } : function ( obj , properties ) {

        obj = touch( obj );
        empty.prototype = obj;
        obj = new empty;

        return augment( obj , properties , true );

    }

    , store = Obj.store = function ( name , obj , properties ) {

        checkIn( name , clone( obj , properties ) );

        return this;
    }

    , type = Obj.type = function ( obj ) {

        return toTypeString.call( obj ).replace( /\[object\s|\]/g , "" ).toLowerCase();

    }

    , is = Obj.is = function ( obj , target ) {

        var targetType = type( target );

        if ( targetType === "object" ) {

            return target === obj || target.isPrototypeOf( obj );

        } else if ( targetType === "function" ) {

            return target === obj || target.prototype.isPrototypeOf( obj );

        }

        return target === obj;

    }

    , owns = Obj.owns = function ( obj , property ) {

        return obj.hasOwnProperty( property );

    }

    , has = Obj.has = function ( obj , property ) {

        return !!obj[ property ];

    }

    , each = Obj.each = function ( obj , handler , all ) {

        var i, len;

        if ( /string|array/.test( type( obj ) ) ) {

            i = 0;
            len = obj.length;

            do {

                handler.call( obj[ i ] , i , obj[ i ] , obj );

            } while ( i++ < len );

        } else {

            for ( i in obj ) {

                if ( all || !owns( obj , i ) ) {

                    handler.call( obj[ i ] , i , obj[ i ] , obj );

                }

            }

        }

        return this;

    }

    , keys = Obj.keys = function ( obj , all ) {

        var result = []
        , key;

        for ( key in obj ) {

            if ( all || owns( obj , key ) ) {

                result.push( key );

            }

        }

        return result;

    }

    , values = Obj.values = function ( obj , all ) {
        
        var result = []
        , key;

        for ( key in obj ) {

            if ( all || owns( obj , key ) ) {

                result.push( obj[ key ] );

            }

        }

        return result;

    }
		
	, expect = function ( method , exp ){

		return function( obj /* [ , candidates ] */ ) {

			var list = slice.call(arguments, 1)
		    , i = list.length;

			while ( i-- ) {

				if( method( obj , list[i] ) === exp ) {

					return exp;

				}

			}

			return !exp;

		}
        
	}
	
	, someAll = "is owns has".split(" ")
    , cur;
		
	while( ( cur = someAll.pop() ) ) {

		Obj[ cur + "All" ] = expect( Obj[ cur ] , false );
		Obj[ cur + "Some" ] = expect( Obj[ cur ] , true );

	}

    Obj.construct = Obj;
	Obj.lib = registry;
    
    global.Objection = Obj;

    if ( !global.Obj ) {

        global.Obj = Obj;

    }
    
}(this));