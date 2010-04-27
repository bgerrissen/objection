/*
 * Object toolkit 'Objection'
 * 
 * @author Ben Gerrissen http://www.netben.nl/ bgerrissen@gmail.com
 * @license MIT
 * @version 1.1
 * 
 */
(function(B){var F=Array.prototype.slice,C=function(){};Obj=function(G){typeof G==="function"&&(G.prototype.constructor=G)&&((G.prototype.constructor=G)&&(G=G.prototype));G=Obj.clone(G);G.constructor&&(arguments.length>1)?G.constructor.apply(G,F.call(arguments,1)):G.constructor();return G};Obj.augment=function(I,J,G){if(!J||!I){return I}for(var H in J){if(!I[H]||G){I[H]=J[H]}}return I};Obj.augment(Obj,{clone:("__proto__" in {}?function(H,G){return G?Obj.augment({__proto__:H},G,1):{__proto__:H}}:function(H,G){!H.__proto__&&H.constructor&&(H.__proto__=H.constructor.prototype);C.prototype=H;H=new C();H.__proto__=C.prototype;return G?Obj.augment(H,G,1):H}),construct:Obj,is:function(H,G){typeof H==="string"&&G===String&&(G=H);typeof G==="function"&&(G=G.prototype);return G===H||G.isPrototypeOf(H)},owns:function(H,G){return H.hasOwnProperty(G)},has:function(H,G){return !!H[G]},each:function(J,I,H){for(var G in J){(H||Obj.owns(J,G))&&I.call(J,G,J[G])}return this},keys:function(J,I){var G=[];for(var H in J){(I||Obj.owns(J,H))&&G.push(H)}return G},values:function(J,I){var G=[];for(var H in J){(I||Obj.owns(J,H))&&G.push(J[H])}return G}});function A(H,G){return function(K){var J=F.call(arguments,1),I=J.length;while(I--){if(H(K,J[I])===G){return G}}return !G}}var D="is owns has".split(/ /),E;while((E=D.pop())){Obj[E+"All"]=A(Obj[E],0);Obj[E+"Some"]=A(Obj[E],1)}B.Objection=Obj;B.Obj||(B.Obj=Obj)}(this));