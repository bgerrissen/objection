/*
 * Object toolkit 'Objection'
 *
 * @author Ben Gerrissen http://www.netben.nl/ bgerrissen@gmail.com
 * @license MIT
 * @version 1.3
 * 
 */

(function(i){var k=Array.prototype.slice,r=Object.prototype.toString,l=function(){},f={},h=function(a){if(typeof a==="string"){if(!f[a])throw"No reference found for: '"+a+"'";return f[a]}return a},d=function(a){a=h(a);if(typeof a==="function"){a.prototype.constructor=a;a=a.prototype}a=m(a);a.constructor&&a.constructor.apply(a,k.call(arguments,1));return a},n=d.augment=function(a,b,e){if(!b||!a)return a;a=h(a);for(var c in b)if(!a[c]||e)a[c]=b[c];return a},m=d.clone="__proto__"in{}?function(a,b){a=
h(a);a={__proto__:a};return n(a,b,true)}:function(a,b){a=h(a);l.prototype=a;a=new l;return n(a,b,true)};d.store=function(a,b,e){b=m(b,e);if(f[a])throw"Another Object is already stored under name: '"+a+"'";f[a]=b;return this};var o=d.type=function(a){return r.call(a).replace(/\[object\s|\]/g,"").toLowerCase()};d.is=function(a,b){var e=o(b);if(e==="object")return b===a||b.isPrototypeOf(a);else if(e==="function")return b===a||b.prototype.isPrototypeOf(a);return b===a};var j=d.owns=function(a,b){return a.hasOwnProperty(b)};
d.has=function(a,b){return!!a[b]};d.each=function(a,b,e){var c;if(/string|array/.test(o(a))){c=0;e=a.length;do b.call(a[c],c,a[c],a);while(c++<e)}else for(c in a)if(e||!j(a,c))b.call(a[c],c,a[c],a);return this};d.keys=function(a,b){var e=[],c;for(c in a)if(b||j(a,c))e.push(c);return e};d.values=function(a,b){var e=[],c;for(c in a)if(b||j(a,c))e.push(a[c]);return e};for(var q=function(a,b){return function(e){for(var c=k.call(arguments,1),p=c.length;p--;)if(a(e,c[p])===b)return b;return!b}},s="is owns has".split(" "),
g;g=s.pop();){d[g+"All"]=q(d[g],false);d[g+"Some"]=q(d[g],true)}d.construct=d;d.lib=f;i.Objection=d;if(!i.Obj)i.Obj=d})(this);