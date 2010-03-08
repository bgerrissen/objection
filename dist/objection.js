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
(function(A){var J=Array.prototype.slice,B={},E={};var C=function(L,K){return function(){var M=L.apply(this._adaptedObject,arguments);return M===this._adaptedObject?K:M}};var I={i:1},H={__proto__:I},F=function(){};var D=Object.create?Object.create:H.i?function(L,K){return K?G.augment({__proto__:L},K,true):{__proto__:L}}:function(L,K){F.prototype=L;L=new F();return K?G.augment(L,K,true):L};var G={augment:function(M,N,K){if(!N||!M){return M}for(var L in N){if(!M[L]||K){M[L]=N[L]}}return M},create:function(L,K){if(E.isPrototypeOf(L)){L=D(L);L._adaptedObject=D(L._adaptedObject,K)}else{if(B.isPrototypeOf(L)){L=D(L,K);L._types=G.augment({},L._types)}else{L=D(L,K)}}L.initialise&&L.initialise();return L},factory:function(N,M,L){var K={};if(M&&L){K[M]=G.create(N,L,true)}return{create:function(P,O){if(P&&!K[P]){throw new TypeError()}return P?G.create(K[P],O,true):G.create(N,O,true)},addType:function(P,O){if(P&&O){K[P]=G.create(N,O,true)}return this},removeType:function(O){delete K[O];return this},clear:function(){K={};return this},_types:K}},adapter:function(M,L){if(E.isPrototypeOf(M)){throw new TypeError()}var K=G.create(E);for(var N in L){if(typeof L[N]==="string"){if(typeof M[L[N]]!=="function"){throw new TypeError()}K[N]=C(M[L[N]],K)}else{if(typeof L[N]==="function"){K[N]=C(L[N],K)}}}K._adaptedObject=M;return K},is:function(K,L){if(!L||!("isPrototypeOf" in L)){throw new TypeError()}return L.isPrototypeOf(K)||L===K},isSome:function(K){var M=J.call(arguments,1),L=M.length;while(L--){if(!("isPrototypeOf" in M[L])){throw new TypeError()}if(M[L].isPrototypeOf(K)||M[L]===K){return true}}return false},isAll:function(K){var M=J.call(arguments,1),L=M.length;while(L--){if(!("isPrototypeOf" in M[L])){throw new TypeError()}if(!M[L].isPrototypeOf(K)&&M[L]!==K){return false}}return true},toClass:function(K,L){L||(L=K.initialise||function(){});L.prototype=D(K);return L}};G=G.augment(G.create,G,true);A.Objection=G;A.Obj||(A.Obj=G)}(window||this));