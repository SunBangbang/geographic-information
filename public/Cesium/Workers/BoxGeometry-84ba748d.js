define(["exports","./GeometryOffsetAttribute-03006e80","./Transforms-62a9f6b9","./Cartesian2-08065eec","./Check-be2d5acb","./ComponentDatatype-a867ddaa","./when-ad3237a0","./GeometryAttribute-5780b24e","./GeometryAttributes-27dc652d","./VertexFormat-fc4fc84a"],function(t,s,y,p,e,x,c,f,A,o){"use strict";var l=new p.Cartesian3;function m(t){var e=(t=c.defaultValue(t,c.defaultValue.EMPTY_OBJECT)).minimum,a=t.maximum,n=c.defaultValue(t.vertexFormat,o.VertexFormat.DEFAULT);this._minimum=p.Cartesian3.clone(e),this._maximum=p.Cartesian3.clone(a),this._vertexFormat=n,this._offsetAttribute=t.offsetAttribute,this._workerName="createBoxGeometry"}m.fromDimensions=function(t){var e=(t=c.defaultValue(t,c.defaultValue.EMPTY_OBJECT)).dimensions,e=p.Cartesian3.multiplyByScalar(e,.5,new p.Cartesian3);return new m({minimum:p.Cartesian3.negate(e,new p.Cartesian3),maximum:e,vertexFormat:t.vertexFormat,offsetAttribute:t.offsetAttribute})},m.fromAxisAlignedBoundingBox=function(t){return new m({minimum:t.minimum,maximum:t.maximum})},m.packedLength=2*p.Cartesian3.packedLength+o.VertexFormat.packedLength+1,m.pack=function(t,e,a){return a=c.defaultValue(a,0),p.Cartesian3.pack(t._minimum,e,a),p.Cartesian3.pack(t._maximum,e,a+p.Cartesian3.packedLength),o.VertexFormat.pack(t._vertexFormat,e,a+2*p.Cartesian3.packedLength),e[a+2*p.Cartesian3.packedLength+o.VertexFormat.packedLength]=c.defaultValue(t._offsetAttribute,-1),e};var a,u=new p.Cartesian3,d=new p.Cartesian3,b=new o.VertexFormat,C={minimum:u,maximum:d,vertexFormat:b,offsetAttribute:void 0};m.unpack=function(t,e,a){e=c.defaultValue(e,0);var n=p.Cartesian3.unpack(t,e,u),r=p.Cartesian3.unpack(t,e+p.Cartesian3.packedLength,d),i=o.VertexFormat.unpack(t,e+2*p.Cartesian3.packedLength,b),e=t[e+2*p.Cartesian3.packedLength+o.VertexFormat.packedLength];return c.defined(a)?(a._minimum=p.Cartesian3.clone(n,a._minimum),a._maximum=p.Cartesian3.clone(r,a._maximum),a._vertexFormat=o.VertexFormat.clone(i,a._vertexFormat),a._offsetAttribute=-1===e?void 0:e,a):(C.offsetAttribute=-1===e?void 0:e,new m(C))},m.createGeometry=function(t){var e=t._minimum,a=t._maximum,n=t._vertexFormat;if(!p.Cartesian3.equals(e,a)){var r,i,o,m=new A.GeometryAttributes;n.position&&(n.st||n.normal||n.tangent||n.bitangent)?(n.position&&((u=new Float64Array(72))[0]=e.x,u[1]=e.y,u[2]=a.z,u[3]=a.x,u[4]=e.y,u[5]=a.z,u[6]=a.x,u[7]=a.y,u[8]=a.z,u[9]=e.x,u[10]=a.y,u[11]=a.z,u[12]=e.x,u[13]=e.y,u[14]=e.z,u[15]=a.x,u[16]=e.y,u[17]=e.z,u[18]=a.x,u[19]=a.y,u[20]=e.z,u[21]=e.x,u[22]=a.y,u[23]=e.z,u[24]=a.x,u[25]=e.y,u[26]=e.z,u[27]=a.x,u[28]=a.y,u[29]=e.z,u[30]=a.x,u[31]=a.y,u[32]=a.z,u[33]=a.x,u[34]=e.y,u[35]=a.z,u[36]=e.x,u[37]=e.y,u[38]=e.z,u[39]=e.x,u[40]=a.y,u[41]=e.z,u[42]=e.x,u[43]=a.y,u[44]=a.z,u[45]=e.x,u[46]=e.y,u[47]=a.z,u[48]=e.x,u[49]=a.y,u[50]=e.z,u[51]=a.x,u[52]=a.y,u[53]=e.z,u[54]=a.x,u[55]=a.y,u[56]=a.z,u[57]=e.x,u[58]=a.y,u[59]=a.z,u[60]=e.x,u[61]=e.y,u[62]=e.z,u[63]=a.x,u[64]=e.y,u[65]=e.z,u[66]=a.x,u[67]=e.y,u[68]=a.z,u[69]=e.x,u[70]=e.y,u[71]=a.z,m.position=new f.GeometryAttribute({componentDatatype:x.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:u})),n.normal&&((r=new Float32Array(72))[0]=0,r[1]=0,r[2]=1,r[3]=0,r[4]=0,r[5]=1,r[6]=0,r[7]=0,r[8]=1,r[9]=0,r[10]=0,r[11]=1,r[12]=0,r[13]=0,r[14]=-1,r[15]=0,r[16]=0,r[17]=-1,r[18]=0,r[19]=0,r[20]=-1,r[21]=0,r[22]=0,r[23]=-1,r[24]=1,r[25]=0,r[26]=0,r[27]=1,r[28]=0,r[29]=0,r[30]=1,r[31]=0,r[32]=0,r[33]=1,r[34]=0,r[35]=0,r[36]=-1,r[37]=0,r[38]=0,r[39]=-1,r[40]=0,r[41]=0,r[42]=-1,r[43]=0,r[44]=0,r[45]=-1,r[46]=0,r[47]=0,r[48]=0,r[49]=1,r[50]=0,r[51]=0,r[52]=1,r[53]=0,r[54]=0,r[55]=1,r[56]=0,r[57]=0,r[58]=1,r[59]=0,r[60]=0,r[61]=-1,r[62]=0,r[63]=0,r[64]=-1,r[65]=0,r[66]=0,r[67]=-1,r[68]=0,r[69]=0,r[70]=-1,r[71]=0,m.normal=new f.GeometryAttribute({componentDatatype:x.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:r})),n.st&&((i=new Float32Array(48))[0]=0,i[1]=0,i[2]=1,i[3]=0,i[4]=1,i[5]=1,i[6]=0,i[7]=1,i[8]=1,i[9]=0,i[10]=0,i[11]=0,i[12]=0,i[13]=1,i[14]=1,i[15]=1,i[16]=0,i[17]=0,i[18]=1,i[19]=0,i[20]=1,i[21]=1,i[22]=0,i[23]=1,i[24]=1,i[25]=0,i[26]=0,i[27]=0,i[28]=0,i[29]=1,i[30]=1,i[31]=1,i[32]=1,i[33]=0,i[34]=0,i[35]=0,i[36]=0,i[37]=1,i[38]=1,i[39]=1,i[40]=0,i[41]=0,i[42]=1,i[43]=0,i[44]=1,i[45]=1,i[46]=0,i[47]=1,m.st=new f.GeometryAttribute({componentDatatype:x.ComponentDatatype.FLOAT,componentsPerAttribute:2,values:i})),n.tangent&&((i=new Float32Array(72))[0]=1,i[1]=0,i[2]=0,i[3]=1,i[4]=0,i[5]=0,i[6]=1,i[7]=0,i[8]=0,i[9]=1,i[10]=0,i[11]=0,i[12]=-1,i[13]=0,i[14]=0,i[15]=-1,i[16]=0,i[17]=0,i[18]=-1,i[19]=0,i[20]=0,i[21]=-1,i[22]=0,i[23]=0,i[24]=0,i[25]=1,i[26]=0,i[27]=0,i[28]=1,i[29]=0,i[30]=0,i[31]=1,i[32]=0,i[33]=0,i[34]=1,i[35]=0,i[36]=0,i[37]=-1,i[38]=0,i[39]=0,i[40]=-1,i[41]=0,i[42]=0,i[43]=-1,i[44]=0,i[45]=0,i[46]=-1,i[47]=0,i[48]=-1,i[49]=0,i[50]=0,i[51]=-1,i[52]=0,i[53]=0,i[54]=-1,i[55]=0,i[56]=0,i[57]=-1,i[58]=0,i[59]=0,i[60]=1,i[61]=0,i[62]=0,i[63]=1,i[64]=0,i[65]=0,i[66]=1,i[67]=0,i[68]=0,i[69]=1,i[70]=0,i[71]=0,m.tangent=new f.GeometryAttribute({componentDatatype:x.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:i})),n.bitangent&&((o=new Float32Array(72))[0]=0,o[1]=1,o[2]=0,o[3]=0,o[4]=1,o[5]=0,o[6]=0,o[7]=1,o[8]=0,o[9]=0,o[10]=1,o[11]=0,o[12]=0,o[13]=1,o[14]=0,o[15]=0,o[16]=1,o[17]=0,o[18]=0,o[19]=1,o[20]=0,o[21]=0,o[22]=1,o[23]=0,o[24]=0,o[25]=0,o[26]=1,o[27]=0,o[28]=0,o[29]=1,o[30]=0,o[31]=0,o[32]=1,o[33]=0,o[34]=0,o[35]=1,o[36]=0,o[37]=0,o[38]=1,o[39]=0,o[40]=0,o[41]=1,o[42]=0,o[43]=0,o[44]=1,o[45]=0,o[46]=0,o[47]=1,o[48]=0,o[49]=0,o[50]=1,o[51]=0,o[52]=0,o[53]=1,o[54]=0,o[55]=0,o[56]=1,o[57]=0,o[58]=0,o[59]=1,o[60]=0,o[61]=0,o[62]=1,o[63]=0,o[64]=0,o[65]=1,o[66]=0,o[67]=0,o[68]=1,o[69]=0,o[70]=0,o[71]=1,m.bitangent=new f.GeometryAttribute({componentDatatype:x.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:o})),(o=new Uint16Array(36))[0]=0,o[1]=1,o[2]=2,o[3]=0,o[4]=2,o[5]=3,o[6]=6,o[7]=5,o[8]=4,o[9]=7,o[10]=6,o[11]=4,o[12]=8,o[13]=9,o[14]=10,o[15]=8,o[16]=10,o[17]=11,o[18]=14,o[19]=13,o[20]=12,o[21]=15,o[22]=14,o[23]=12,o[24]=18,o[25]=17,o[26]=16,o[27]=19,o[28]=18,o[29]=16,o[30]=20,o[31]=21,o[32]=22,o[33]=20,o[34]=22,o[35]=23):((u=new Float64Array(24))[0]=e.x,u[1]=e.y,u[2]=e.z,u[3]=a.x,u[4]=e.y,u[5]=e.z,u[6]=a.x,u[7]=a.y,u[8]=e.z,u[9]=e.x,u[10]=a.y,u[11]=e.z,u[12]=e.x,u[13]=e.y,u[14]=a.z,u[15]=a.x,u[16]=e.y,u[17]=a.z,u[18]=a.x,u[19]=a.y,u[20]=a.z,u[21]=e.x,u[22]=a.y,u[23]=a.z,m.position=new f.GeometryAttribute({componentDatatype:x.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:u}),(o=new Uint16Array(36))[0]=4,o[1]=5,o[2]=6,o[3]=4,o[4]=6,o[5]=7,o[6]=1,o[7]=0,o[8]=3,o[9]=1,o[10]=3,o[11]=2,o[12]=1,o[13]=6,o[14]=5,o[15]=1,o[16]=2,o[17]=6,o[18]=2,o[19]=3,o[20]=7,o[21]=2,o[22]=7,o[23]=6,o[24]=3,o[25]=0,o[26]=4,o[27]=3,o[28]=4,o[29]=7,o[30]=0,o[31]=1,o[32]=5,o[33]=0,o[34]=5,o[35]=4);var u,a=p.Cartesian3.subtract(a,e,l),e=.5*p.Cartesian3.magnitude(a);return c.defined(t._offsetAttribute)&&(a=u.length,u=new Uint8Array(a/3),a=t._offsetAttribute===s.GeometryOffsetAttribute.NONE?0:1,s.arrayFill(u,a),m.applyOffset=new f.GeometryAttribute({componentDatatype:x.ComponentDatatype.UNSIGNED_BYTE,componentsPerAttribute:1,values:u})),new f.Geometry({attributes:m,indices:o,primitiveType:f.PrimitiveType.TRIANGLES,boundingSphere:new y.BoundingSphere(p.Cartesian3.ZERO,e),offsetAttribute:t._offsetAttribute})}},m.getUnitBox=function(){return a=!c.defined(a)?m.createGeometry(m.fromDimensions({dimensions:new p.Cartesian3(1,1,1),vertexFormat:o.VertexFormat.POSITION_ONLY})):a},t.BoxGeometry=m});
