define(["exports","./Check-be2d5acb","./when-ad3237a0","./Math-5ca9b250"],function(e,t,h,r){"use strict";var c=r.CesiumMath.EPSILON10;e.arrayRemoveDuplicates=function(e,t,r){if(h.defined(e)){r=h.defaultValue(r,!1);var a,n,i,f=e.length;if(f<2)return e;for(a=1;a<f&&!t(n=e[a-1],i=e[a],c);++a);if(a===f)return r&&t(e[0],e[e.length-1],c)?e.slice(1):e;for(var u=e.slice(0,a);a<f;++a)t(n,i=e[a],c)||(u.push(i),n=i);return r&&1<u.length&&t(u[0],u[u.length-1],c)&&u.shift(),u}}});