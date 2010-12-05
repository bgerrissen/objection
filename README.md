Objection
=====

A small OO toolkit for JS to provide cleaner code and grant the possibilities to instantiate or subclass objects directly.
Obj() or Objection() will serve as an alternative to the 'new' operator.

Instead of:

    function MyClass(){}

    MyClass.prototype = {
        method: function(){}
    }
    var instance = new MyClass();

write:

    var MyObject = {
        method: function(){}
    }
    var instance = Obj( MyObject );

Result, much cleaner code, less fumbling with .prototype, more Object Oriented.
The Obj() function also works with function classes.

    var instance = Obj( MyCass );

Extra parameters passed to Obj() will be inserted into the target's constructor function.

    var MyObject = {
        constructor : function( foo ){
            this.foo = foo;
        }
        method: function(){
            alert( this.foo );
        }
    }
    var instance = Obj( MyObject , "bar" );
    instance.method(); // alerts bar

**** Subclassing ****

Subclassing is actually nothing more then cloning and augmenting the new object with new properties.

    var Mammal = {}
    var Cat = Obj.clone( Mammal , {
        says : "purrr"
    } );
    var Dog = Obj.clone( Mammal , {
        says : "woof"
    } );

**** Extra helper methods ****

Objection also provides some convenient methods.

    Obj.is( Cat , Mammal ); // true
    Obj.is( Cat , Dog ); // false
    Obj.isSome( Cat , Dog , Mammal ); // true
    Obj.isAll( Cat , Dog , Mammal ); // false

    Obj.has( Mammal , "says" ); // false
    Obj.has( Cat , "says" ); // true
    Obj.hasAll( Cat , "says" , "engine" ); // false
    Obj.hasSome( Cat , "says" , "engine" ); // true

And more!

Check the wiki for documentation, I actually spent quite some time filling it out ;)


**** Version ****

* v1.3

### License ###

Objection is licensed under the terms of the MIT License, see the included MIT-LICENSE file.
