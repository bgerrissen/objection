/*
 * Object toolkit 'Objection'
 * 
 * @author Ben Gerrissen http://www.netben.nl/ bgerrissen@gmail.com
 * @license MIT
 * @version 1.2
 * 
 */
(function(C){var H=Array.prototype.slice,F=function(){};var A={},B={};var E=function(M){var N=A,L=M.split(".");var K=B[M]||B[L[L.length-1]];if(!K){throw"No reference found: "+M}if(K.length>1){throw"Multiple references found, try using full namespace: "+M}if(K.length===1){return K[0]}do{N=N[L[0]]}while(L.shift()&&N&&L.length);if(!N){throw"No reference found: "+M}return N};var D=function(L,N){var M=A,K=L.split(".");K.length>1&&(B[L]?B[L].push(N):(B[L]=[N]));do{if(K.length===1&&M[K[0]]){throw"Object already defined: "+L}M=M[K[0]]||(M[K[0]]=K.length===1?N:{});K.length===1&&B[K[0]]?B[K[0]].push(N):(B[K[0]]=[N])}while(K.shift()&&K.length)};Obj=function(K){typeof K==="string"&&(K=E(K));typeof K==="function"&&(K.prototype.constructor=K)&&((K.prototype.constructor=K)&&(K=K.prototype));K=Obj.clone(K);K.constructor&&(arguments.length>1)?K.constructor.apply(K,H.call(arguments,1)):K.constructor();return K};Obj.augment=function(M,N,K){if(!N||!M){return M}typeof M==="string"&&(M=E(M));for(var L in N){if(!M[L]||K){M[L]=N[L]}}return M};Obj.augment(Obj,{clone:("__proto__" in {}?function(L,K){typeof L==="string"&&(L=E(L));return K?Obj.augment({__proto__:L},K,1):{__proto__:L}}:function(L,K){typeof L==="string"&&(L=E(L));!L.__proto__&&L.constructor&&(L.__proto__=L.constructor.prototype);F.prototype=L;L=new F();L.__proto__=F.prototype;return K?Obj.augment(L,K,1):L}),construct:Obj,store:function(L,M,K){M=(M&&K)?Obj.clone(M,K):Obj.clone(M);M.oType=L.split(".").pop();D(L,M);return this},is:function(L,K){typeof L==="string"&&K===String&&(K=L);typeof K==="function"&&(K=K.prototype);return K===L||K.isPrototypeOf(L)},owns:function(L,K){return L.hasOwnProperty(K)},has:function(L,K){return !!L[K]},each:function(N,M,L){for(var K in N){(L||Obj.owns(N,K))&&M.call(N,K,N[K])}return this},keys:function(N,M){var K=[];for(var L in N){(M||Obj.owns(N,L))&&K.push(L)}return K},values:function(N,M){var K=[];for(var L in N){(M||Obj.owns(N,L))&&K.push(N[L])}return K}});function I(L,K){return function(O){var N=H.call(arguments,1),M=N.length;while(M--){if(L(O,N[M])===K){return K}}return !K}}var G="is owns has".split(/ /),J;while((J=G.pop())){Obj[J+"All"]=I(Obj[J],0);Obj[J+"Some"]=I(Obj[J],1)}Obj.lib=A;C.Objection=Obj;C.Obj||(C.Obj=Obj)}(this));