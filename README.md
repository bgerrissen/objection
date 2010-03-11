Objection
=====

A small OO toolkit for JS to prepare people to write JS the Object.create way.

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
var instance = Obj.create(MyObject);

Result, much cleaner code, less fumbling with .prototype, more Object Oriented.

Check the wiki for documentation, I actually spent quite some time filling it out ;)


**** Version ****

* v1.0

**** Version History ****

* march 11th, 2010

### License ###

Objection is licensed under the terms of the MIT License, see the included MIT-LICENSE file.
