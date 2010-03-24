if (typeof load != 'undefined') {
  load('riot.js');
}

Riot.run(function(){
    
    context('1. Objection#augment tests', function(){
        
        given('1.1 override argument set to false', function(){
            
            var base = {
                id: 1
            };
            
            Obj.augment(base, {
               id: 2,
               name: 'jane'
            });
            
            should('add name property and equal jane', base.name).equals('jane');
            should('not override id property', base.id).equals(1);
            
        });
        
        given('1.2 override argument set to true', function(){
            
            var base = {
                id: 1
            };
            
            Obj.augment(base, {
               id: 2,
               name: 'jane'
            }, true);
            
            should('add name property and equal jane', base.name).equals('jane');
            should('override id property', base.id).equals(2);
            
        });
        
    });
    
    context('2. Objection#create tests', function(){
        
        given('2.1 object creation/instantiation without extra properties', function(){
            
            var base = {
                id: 1
            };
            
            var instance = Obj.create(base);
            
            asserts('is not exactly the same object', instance === base).isFalse();
            asserts('inherits from base object', base.isPrototypeOf(instance)).isTrue();
            should('contain same id as base object', instance.id).equals(1);
            
        });
        
        given('2.2 object creation/instantiation with extra properties', function(){
            
            var base = {
                id: 1
            };
            
            var instance = Obj.create(base, {
                name: 'jane',
                gender: 'female',
                id: 2
            });
            
            asserts('is not exactly the same object', instance === base).isFalse();
            asserts('inherits from base object', base.isPrototypeOf(instance)).isTrue();
            should('add name property and equal jane', instance.name).equals('jane');
            should('add gender property and equal female', instance.name).equals('jane');
            should('override id property', instance.id).equals(2);
            
        });
        
    });
    
    context('3. Objection#is test', function(){
        
        var Mammal = function(){}
        var mammal = new Mammal();
        var feline = Obj.create(mammal);
        var cat = Obj.create(feline);
        var canine = Obj.create(mammal);
        var dog = Obj.create(canine);
        
        asserts('a cat is an instance of Mammal', Obj.is(cat, Mammal)).isTrue();
        asserts('a cat is a mammal', Obj.is(cat, mammal)).isTrue();
        asserts('a cat is a feline', Obj.is(cat, feline)).isTrue();
        asserts('a cat is a cat', Obj.is(cat, cat)).isTrue();
        asserts('a cat is not a canine', Obj.is(cat, canine)).isFalse();
        asserts('a cat is not a dog', Obj.is(cat, dog)).isFalse();
        
    });
    
    context('4. Objection#isSome test', function(){
        
        var Mammal = function(){}
        var mammal = new Mammal();
        var insect = {};
        var fish = {};
        var feline = Obj.create(mammal);
        var cat = Obj.create(feline);
        
        asserts('a cat is a mammal or an insect', Obj.isSome(cat, mammal, insect)).isTrue();
        asserts('a cat is neither an insect or a fish', Obj.isSome(cat, insect, fish)).isFalse();
        
    });
    
    context('5. Objection#isAll test', function(){
        
        var mammal = {};
        var insect = {};
        var fish = {};
        var feline = Obj.create(mammal);
        var cat = Obj.create(feline);
        
        asserts('a cat is a mammal and a feline', Obj.isAll(cat, mammal, feline)).isTrue();
        asserts('a cat is not both a mammal and a fish', Obj.isAll(cat, mammal, fish)).isFalse();
        
    });
    
    context('6. Objection#adapter', function(){
        
        given('6.1. exposing methods under different names using a map', function(){
            
            var obj = {
                method: function(){
                    return true;
                },
                self: function(){
                    return this;
                },
                id: 1
            };
            
            var adaptee = Obj.adapter(obj, {
                met: 'method',
                sel: 'self'
            });
            
            asserts('adapter is a new object and thus not the original', adaptee === obj).isFalse();
            asserts('adapter does not contain the obj method', !!adaptee.method).isFalse();
            asserts('adapter contains a met method', !!adaptee.met).isTrue();
            asserts('adapter contains a sel method', !!adaptee.met).isTrue();
            asserts('adapter met method returns true', adaptee.met()).isTrue();
            asserts('id property should not be present on adapter', !!adaptee.id).isFalse();
            should('return adapter instead of obj when calling sel method', adaptee.sel()).equals(adaptee);
            
            
        });
        
        given('6.2. Adapter methods should accept and relay arguments to enclosed object', function(){
            
            var obj = {
                method: function(arg1, arg2){
                    return arg1 + arg2;
                },
                self: function(id){
                    this.id = id;
                    return this.id;
                },
                id: 1
            };
            
            var adaptee = Obj.adapter(obj, {
                met: 'method',
                sel: 'self'
            });
            
            should('return both arguments concated into a single string', adaptee.met('hello', ' world')).equals('hello world');
            should('change the objects id and return it', adaptee.sel(2)).equals(2);
            asserts('adapter should not contain id property', !!adaptee.id).isFalse();
            
            
        });
        
        given('6.3. New adapter methods', function(){
            
            var obj = {
                method1: function(arg1, arg2){
                    return arg1+arg2;
                },
                method2: function(arg3){
                    return arg3;
                }
            };
            
            var adaptee = Obj.adapter(obj,{
                both: function(arg1, arg2, arg3){
                    return this.method1(arg1, arg2) + this.method2(arg3);
                },
                reorder: function(arg1, arg2){
                    return this.method1(arg2, arg1);
                },
                met: 'method1'
            });
            
            asserts('adapter contains a met method', !!adaptee.met).isTrue();
            
            should('return "hello world all"', adaptee.both('hello ', 'world ', 'all')).equals('hello world all');
            should('return "world hello "', adaptee.reorder('hello ', 'world ')).equals('world hello ');
            
        });
        
    });
    
    context('7. Objection#factory', function(){
        
        given('7.1. without initial instance type definition', function(){
            
            var Mammal = {
                makeSound: function(){
                    return this.intro + ' ' + this.sound;
                },
                intro: 'A mammal',
                sound: 'makes a sound.'
            };
            
            var MammalFactory = Obj.factory(Mammal);
            
            MammalFactory.addType('cat', {
                intro: 'A cat',
                sound: 'goes miauw.'
            });
            
            MammalFactory.addType('dog', {
                intro: 'A dog',
                sound: 'goes woof.'
            });
            
            var mammal = MammalFactory.create();
            var cat = MammalFactory.create('cat');
            var dog = MammalFactory.create('dog');
            
            should('equal "A mammal makes a sound."', mammal.makeSound()).equals('A mammal makes a sound.');
            should('equal "A cat goes miauw."', cat.makeSound()).equals('A cat goes miauw.');
            should('equal "A dog goes woof."', dog.makeSound()).equals('A dog goes woof.');
            
            asserts('Mammal is prototype of mammal', Mammal.isPrototypeOf(mammal)).isTrue();
            asserts('Mammal is prototype of cat', Mammal.isPrototypeOf(cat)).isTrue();
            asserts('Mammal is prototype of dog', Mammal.isPrototypeOf(dog)).isTrue();
            
            
        });
        
        given('7.1. with initial instance type definition', function(){
            
            var Creature = {
                makeSound: function(){
                    return this.intro + ' ' + this.sound;
                }
            };
            
            var MammalFactory = Obj.factory(Creature, 'mammal', {
                intro: 'A mammal',
                sound: 'makes a sound.'
            });
            
            MammalFactory.addType('cat', {
                intro: 'A cat',
                sound: 'goes miauw.'
            });
            
            MammalFactory.addType('dog', {
                intro: 'A dog',
                sound: 'goes woof.'
            });
            
            var mammal = MammalFactory.create('mammal');
            var cat = MammalFactory.create('cat');
            var dog = MammalFactory.create('dog');
            
            should('equal "A mammal makes a sound."', mammal.makeSound()).equals('A mammal makes a sound.');
            should('equal "A cat goes miauw."', cat.makeSound()).equals('A cat goes miauw.');
            should('equal "A dog goes woof."', dog.makeSound()).equals('A dog goes woof.');
            
            asserts('Creature is prototype of mammal', Creature.isPrototypeOf(mammal)).isTrue();
            asserts('Creature is prototype of cat', Creature.isPrototypeOf(cat)).isTrue();
            asserts('Creature is prototype of dog', Creature.isPrototypeOf(dog)).isTrue();

        });
        
    });
    
    context('8 Objection#construct', function(){
        
        given('8.1 constructor set',function(){
            
            var Mammal = {
                constructor: function(){
                    this.id = 'mammal';
                }
            };
            
            var mammal = Obj.construct(Mammal);
            
            should('contain id "mammal"', mammal.id).equals('mammal');
            
        });
        
    });
    
    context('9 Objection#has', function(){
        
        given('9.1 an object containing properties', function(){
            
            var obj = {
                bar: 'bar',
                foo: 'foo'
            };
            
            asserts('contains "foo" property', Obj.has(obj, 'foo')).isTrue();
            asserts('contains "bar" property', Obj.has(obj, 'bar')).isTrue();
            
        });
        
    });
    context('10 Objection#hasSome', function(){
        
        given('10.1 an object containing properties', function(){
            
            var obj = {
                bar: 'bar',
                foo: 'foo'
            };
            
            asserts('contains at least one of "foo", "car" properties', Obj.hasSome(obj, 'foo', 'car')).isTrue();
            asserts('contains at least one of "foo", "bar" properties', Obj.hasSome(obj, 'foo', 'bar')).isTrue();
            asserts('does not contain any of "car", "far" properties', Obj.hasSome(obj, 'car', 'far')).isFalse();
            
        });
        
    });
    context('11 Objection#hasAll', function(){
        
        given('11.1 an object containing properties', function(){
            
            var obj = {
                bar: 'bar',
                foo: 'foo'
            };
            
            asserts('contains all of "foo", "bar" properties', Obj.hasAll(obj, 'foo', 'bar')).isTrue();
            asserts('does not contain "car"', Obj.hasAll(obj, 'car', 'bar')).isFalse();
            
        });
        
    });
    context('12 Objection#owns', function(){
        
        given('12.1 an object containing properties', function(){
            
            var obj = {
                boo: 'boo'
            };
            
            obj = Obj.create(obj, {
                bar: 'bar',
                foo: 'foo'
            });
            
            asserts('has own property "bar"', Obj.owns(obj, 'bar')).isTrue();
            asserts('has own property "foo"', Obj.owns(obj, 'foo')).isTrue();
            asserts('"boo" is not an own property', Obj.owns(obj, 'boo')).isFalse();
            
        });
        
    });
    
    context('13 Objection#ownsSome', function(){
        
        given('13.1 an object containing properties', function(){
            
            var obj = {
                boo: 'boo'
            };
            
            obj = Obj.create(obj, {
                bar: 'bar',
                foo: 'foo'
            });
            
            asserts('has at least one own property: "bar", "foo", "boo"', Obj.ownsSome(obj, 'bar', 'foo', 'boo')).isTrue();
            asserts('"boo" is not an own property', Obj.ownsSome(obj, 'boo')).isFalse();
            
        });
        
    });
    
    context('14 Objection#ownsAll', function(){});
    
    context('15 Objection#keys', function(){
        
        given('15.1 a hash', function(){
            
            var hash = {
                a : 1,
                b : 2
            };
            
            var keys = Obj.keys(hash);
            
            should('contain 2 "own" items', keys.length).equals(2);
            
        });
        
        given('15.2 a hash drawn from another hash', function(){
            
            var hash = {
                a : 1,
                b : 2
            };
            
            var delta = Obj.create(hash, {
                c : 3
            });
            
            var keys = Obj.keys(delta);
            
            should('contain 1 "own" items', keys.length).equals(1);
            
        });
        
    });
    
    context('16 Objection#values', function(){});
    
});
