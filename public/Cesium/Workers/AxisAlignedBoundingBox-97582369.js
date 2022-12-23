define(["exports","./Cartesian2-08065eec","./Check-be2d5acb","./when-ad3237a0","./Transforms-62a9f6b9"],function(e,x,n,h,t){"use strict";function y(e,n,a){this.minimum=x.Cartesian3.clone(h.defaultValue(e,x.Cartesian3.ZERO)),this.maximum=x.Cartesian3.clone(h.defaultValue(n,x.Cartesian3.ZERO)),a=h.defined(a)?x.Cartesian3.clone(a):x.Cartesian3.midpoint(this.minimum,this.maximum,new x.Cartesian3),this.center=a}y.fromPoints=function(e,n){if(h.defined(n)||(n=new y),!h.defined(e)||0===e.length)return n.minimum=x.Cartesian3.clone(x.Cartesian3.ZERO,n.minimum),n.maximum=x.Cartesian3.clone(x.Cartesian3.ZERO,n.maximum),n.center=x.Cartesian3.clone(x.Cartesian3.ZERO,n.center),n;for(var a=e[0].x,i=e[0].y,t=e[0].z,m=e[0].x,r=e[0].y,s=e[0].z,u=e.length,c=1;c<u;c++)var o=e[c],l=o.x,C=o.y,o=o.z,a=Math.min(l,a),m=Math.max(l,m),i=Math.min(C,i),r=Math.max(C,r),t=Math.min(o,t),s=Math.max(o,s);var d=n.minimum;d.x=a,d.y=i,d.z=t;var f=n.maximum;return f.x=m,f.y=r,f.z=s,n.center=x.Cartesian3.midpoint(d,f,n.center),n},y.clone=function(e,n){if(h.defined(e))return h.defined(n)?(n.minimum=x.Cartesian3.clone(e.minimum,n.minimum),n.maximum=x.Cartesian3.clone(e.maximum,n.maximum),n.center=x.Cartesian3.clone(e.center,n.center),n):new y(e.minimum,e.maximum,e.center)},y.equals=function(e,n){return e===n||h.defined(e)&&h.defined(n)&&x.Cartesian3.equals(e.center,n.center)&&x.Cartesian3.equals(e.minimum,n.minimum)&&x.Cartesian3.equals(e.maximum,n.maximum)};var m=new x.Cartesian3;y.intersectPlane=function(e,n){m=x.Cartesian3.subtract(e.maximum,e.minimum,m);var a=x.Cartesian3.multiplyByScalar(m,.5,m),i=n.normal,a=a.x*Math.abs(i.x)+a.y*Math.abs(i.y)+a.z*Math.abs(i.z),n=x.Cartesian3.dot(e.center,i)+n.distance;return 0<n-a?t.Intersect.INSIDE:n+a<0?t.Intersect.OUTSIDE:t.Intersect.INTERSECTING},y.prototype.clone=function(e){return y.clone(this,e)},y.prototype.intersectPlane=function(e){return y.intersectPlane(this,e)},y.prototype.equals=function(e){return y.equals(this,e)},e.AxisAlignedBoundingBox=y});