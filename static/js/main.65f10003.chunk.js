(this["webpackJsonpproject-glitter"]=this["webpackJsonpproject-glitter"]||[]).push([[0],{49:function(e,t,r){},61:function(e,t,r){"use strict";r.r(t);var n=r(0),a=r.n(n),o=r(12),i=r.n(o),c=(r(49),r(23)),u=r(9),f=r.n(u),d=r(17),l=r(26),s=r(27),y=r(28),g=r(35),m=r(36),h=r(42),x=r(30),A=function(e){Object(y.a)(r,e);var t=Object(g.a)(r);function r(e){var n;Object(l.a)(this,r),(n=t.call(this))._audioElementId=void 0,n._analyserNode=null,n._audioContext=null,n._audioElementId=e;var a=document.getElementById(n._audioElementId),o=Object(x.a)(n);return a.addEventListener("canplaythrough",(function(e){o.dispatchEvent(new Event(r.MediaReady))})),n}return Object(s.a)(r,[{key:"loadMedia",value:function(e){document.getElementById(this._audioElementId).src=e}},{key:"connect",value:function(){if(!this._audioContext){this._audioContext=new AudioContext;var e=document.getElementById(this._audioElementId),t=this._audioContext.createMediaElementSource(e);this._analyserNode=this._audioContext.createAnalyser(),this._analyserNode.fftSize=512,t.connect(this._analyserNode),this._analyserNode.connect(this._audioContext.destination)}}},{key:"play",value:function(){var e=document.getElementById(this._audioElementId);e.paused||e.ended?e.play():e.pause()}},{key:"getByteFrequencyData",value:function(e){return!!this._analyserNode&&(this._analyserNode.getByteFrequencyData(e),!0)}}]),r}(Object(m.a)(EventTarget));function v(e){e.WebGL=e.WebGL||{},e.Utilities=e.Utilities||{};var t=e.WebGL,r=e.Utilities;t.contextArray=[],t.textureArray=[],t.imageDataArray=[],t.programArray=[],t.shaderArray=[],t.bufferArray=[],t.frameBufferArray=[],t.renderBufferArray=[],t.uniformLocationArray=[],t.vaoArray=[],t.createContextFromCanvas=function(e,r){var n=t.__getString(e),a=document.getElementById(n);if(!a)throw new Error("Invalid canvas id: ".concat(n));var o=a,i=t.__getString(r),c=o.getContext(i);c||"webgl2"!==i||(c=o.getContext("webgl"));var u=c,f=u.getParameter(u.MAX_VERTEX_UNIFORM_VECTORS),d=u.getParameter(u.MAX_FRAGMENT_UNIFORM_VECTORS);console.log("MAX_VERTEX_UNIFORM_VECTORS: ".concat(f)),console.log("MAX_FRAGMENT_UNIFORM_VECTORS: ".concat(d));var l=t.contextArray.findIndex((function(e){return null==e}));return-1===l?(l=t.contextArray.length,t.contextArray.push(u)):t.contextArray[l]=u,l},t.getDrawingBufferWidth=function(e){return t.contextArray[e].drawingBufferWidth},t.getDrawingBufferHeight=function(e){return t.contextArray[e].drawingBufferHeight},t.enable=function(e,r){t.contextArray[e].enable(r)},t.blendFunc=function(e,r,n){t.contextArray[e].blendFunc(r,n)},t.createShader=function(e,r){var n=t.shaderArray.findIndex((function(e){return null==e})),a=t.contextArray[e].createShader(r);return-1===n?(n=t.shaderArray.length,t.shaderArray.push(a)):t.shaderArray[n]=a,n},t.shaderSource=function(e,r,n){t.contextArray[e].shaderSource(t.shaderArray[r],t.__getString(n))},t.compileShader=function(e,r){t.contextArray[e].compileShader(t.shaderArray[r]);var n=t.contextArray[e].getShaderInfoLog(t.shaderArray[r]);n&&n.length>0&&console.log("compileShader: ".concat(n))},t.createProgram=function(e){var r=t.programArray.findIndex((function(e){return null==e})),n=t.contextArray[e].createProgram();return-1===r?(r=t.programArray.length,t.programArray.push(n)):t.programArray[r]=n,r},t.attachShader=function(e,r,n){t.contextArray[e].attachShader(t.programArray[r],t.shaderArray[n])},t.linkProgram=function(e,r){var n=t.contextArray[e],a=t.programArray[r];n.linkProgram(a),n.getProgramParameter(a,n.LINK_STATUS)||console.log(n.getProgramInfoLog(a))},t.getProgramParameter=function(e,r,n){var a=t.contextArray[e],o=t.programArray[r];return a.getProgramParameter(o,n)},t.getProgramInfoLog=function(e,r){var n=t.contextArray[e],a=t.programArray[r],o=n.getProgramInfoLog(a);return t.__newString(o)},t.useProgram=function(e,r){t.contextArray[e].useProgram(t.programArray[r])},t.createBuffer=function(e){var r=t.bufferArray.findIndex((function(e){return null==e})),n=t.contextArray[e].createBuffer();return-1===r?(r=t.bufferArray.length,t.bufferArray.push(n)):t.bufferArray[r]=n,r},t.bindBuffer=function(e,r,n){t.contextArray[e].bindBuffer(r,t.bufferArray[n])},t.createTexture=function(e){var r=t.textureArray.findIndex((function(e){return null==e})),n=t.contextArray[e].createTexture();return-1===r?(r=t.textureArray.length,t.textureArray.push(n)):t.textureArray[r]=n,r},t.bindTexture=function(e,r,n){t.contextArray[e].bindTexture(r,t.textureArray[n])},t.texImage2D=function(e,r,n,a,o,i,c){var u=t.contextArray[e],f=t.imageDataArray[c];u.texImage2D(r,n,a,o,i,f)},t.activeTexture=function(e,r){t.contextArray[e].activeTexture(r)},t.texParameteri=function(e,r,n,a){t.contextArray[e].texParameteri(r,n,a)},t.getAttribLocation=function(e,r,n){var a=t.__getString(n),o=t.programArray[r];return t.contextArray[e].getAttribLocation(o,a)},t.enableVertexAttribArray=function(e,r){t.contextArray[e].enableVertexAttribArray(r)},t.getUniformLocation=function(e,r,n){var a=t.contextArray[e],o=t.programArray[r],i=t.uniformLocationArray.findIndex((function(e){return null==e})),c=a.getUniformLocation(o,t.__getString(n));return-1===i?(i=t.uniformLocationArray.length,t.uniformLocationArray.push(c)):t.uniformLocationArray[i]=c,i},t.uniform1f=function(e,r,n){var a=t.uniformLocationArray[r];t.contextArray[e].uniform1f(a,n)},t.uniform1fv=function(e,r,n){var a=t.uniformLocationArray[r],o=t.__getArrayView(n);t.contextArray[e].uniform1fv(a,o)},t.uniform2f=function(e,r,n,a){var o=t.uniformLocationArray[r];t.contextArray[e].uniform2f(o,n,a)},t.uniform1i=function(e,r,n){var a=t.uniformLocationArray[r];t.contextArray[e].uniform1i(a,n)},t.clear=function(e,r){t.contextArray[e].clear(r)},t.clearColor=function(e,r,n,a,o){t.contextArray[e].clearColor(r,n,a,o)},t.viewport=function(e,r,n,a,o){t.contextArray[e].viewport(r,n,a,o)};var n=function(e,r,n,a){t.contextArray[e].bufferData(r,t.__getArrayView(n),a)};t["bufferData<f32>"]=n,t["bufferData<f64>"]=n,t["bufferData<i32>"]=n,t["bufferData<u16>"]=n,t.vertexAttribPointer=function(e,r,n,a,o,i,c){t.contextArray[e].vertexAttribPointer(r,n,a,!!o,i,c)},t.drawArrays=function(e,r,n,a){t.contextArray[e].drawArrays(r,n,a)},e.WebGL.drawElements=function(e,r,n,a,o){t.contextArray[e].drawElements(r,n,a,o)},r.getImageData=function(r){var n=t.__getString(r),a=e.images[n],o=t.imageDataArray.length;return t.imageDataArray.push(a),o}}function p(e,t){Object.entries(t).forEach((function(t){var r=Object(c.a)(t,2),n=r[0],a=r[1];n.startsWith("__")&&"function"===typeof a&&(e.WebGL[n]=a)}))}A.MediaReady="media-ready";var b=function(e){Object(y.a)(r,e);var t=Object(g.a)(r);function r(){var e;Object(l.a)(this,r);for(var n=arguments.length,a=new Array(n),o=0;o<n;o++)a[o]=arguments[o];return(e=t.call.apply(t,[this].concat(a)))._exports=null,e._eventRegistered=!1,e._mediaController=null,e}return Object(s.a)(r,[{key:"initialize",value:function(){var e=Object(d.a)(f.a.mark((function e(){var t,n,a,o,i,c,u,d,l,s=this;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!this._exports){e.next=2;break}throw new Error("Application.initialize is called twice");case 2:return this._mediaController=new A("audio-source"),this._mediaController.loadMedia(this._resolveFilePath("Bajan-Canadian.mp3")),this._mediaController.addEventListener(A.MediaReady,(function(){s._eventRegistered||(s._eventRegistered=!0,document.addEventListener("click",(function(){s._mediaController&&(s._mediaController.connect(),s._mediaController.play())}))),s.dispatchEvent(new Event(r.MediaReady))})),e.next=7,this._preloadResources("circle.png");case 7:return t=e.sent,(n=document.getElementById("canvas-3d")).width=n.clientWidth,n.height=n.clientHeight,a=new WebAssembly.Memory({initial:100}),v(o={env:{memory:a},images:t}),e.next=16,fetch(this._resolveFilePath("renderer.wasm"));case 16:return i=e.sent,e.next=19,h.a.instantiateStreaming(i,o);case 19:return c=e.sent,this._exports=c.exports,p(o,this._exports),u=this._exports.__newString,d=u("canvas-3d"),l=u("webgl2"),this._exports.initialize(d,l),e.abrupt("return",!0);case 27:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"startRenderLoop",value:function(e){var t=this._exports,r=t.updateFrame,n=t.renderFrame,a=t.getFrequencyBuffer,o=(0,t.__getArrayView)(a()),i=0,c=Date.now(),u=this;requestAnimationFrame((function t(){u._mediaController&&u._mediaController.getByteFrequencyData(o)&&r(),i++;var a=Date.now(),f=a-c;f>=1e3&&(c=a,e(1e3*i/f),i=0),n(),requestAnimationFrame(t)}))}},{key:"_preloadResources",value:function(){var e=Object(d.a)(f.a.mark((function e(t){var r=this;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e,n){var a=new Image;a.onload=function(r){var n=document.createElement("canvas").getContext("2d");n.drawImage(a,0,0);var o=n.getImageData(0,0,a.width,a.height),i={};i[t]=o,e(i)},a.onerror=function(e){n(e?e.toString():"")},a.src=r._resolveFilePath(t)})));case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},{key:"_resolveFilePath",value:function(e){return"".concat(window.location.pathname,"/").concat(e)}}]),r}(Object(m.a)(EventTarget));b.MediaReady="media-ready";var _=r(82),j=r(83),w=r(40),O=r.n(w),E=r(41),I=r(80),C=r(81),L=r(3),S=Object(E.a)({palette:{type:"dark"}}),P=Object(I.a)((function(e){return{root:{display:"flex",flexDirection:"column",height:"calc(100% - ".concat(e.spacing(4),"px)"),padding:"".concat(e.spacing(2),"px")},header:{},content:{flexGrow:1},footer:{display:"flex",flexDirection:"row",alignItems:"flex-end",justifyContent:"space-between"},footerLeft:{},footerRight:{},iconButton:{margin:"0px",padding:"0px"}}}));var R=function(){var e=P(),t=Object(n.useRef)(),r=Object(n.useState)(0),a=Object(c.a)(r,2),o=a[0],i=a[1],u=Object(n.useState)(!1),f=Object(c.a)(u,2),d=f[0],l=f[1];function s(e){i(e)}return Object(n.useEffect)((function(){if(!t.current){var e=new b;t.current=e,e.addEventListener(b.MediaReady,(function(){l(!0)})),e.initialize().then((function(t){t&&e.startRenderLoop(s)}))}}),[]),Object(L.jsx)(C.a,{theme:S,children:Object(L.jsxs)("div",{className:e.root,children:[Object(L.jsx)("div",{className:e.header,children:Object(L.jsx)(_.a,{variant:"body2",color:"textPrimary",children:d?"Fps: ".concat(o.toFixed(2)):"Media Not Ready"})}),Object(L.jsx)("div",{className:e.content}),Object(L.jsxs)("div",{className:e.footer,children:[Object(L.jsx)("div",{className:e.footerLeft,children:Object(L.jsx)(_.a,{variant:"body2",color:"textPrimary",children:d?"Click to play 'Bajan Canadian (Minecraft Mix)'":""})}),Object(L.jsx)("div",{className:e.footerRight,children:Object(L.jsx)(j.a,{"aria-label":"delete",className:e.iconButton,target:"_blank",href:"https://github.com/benglin/project-glitter",children:Object(L.jsx)(O.a,{color:"secondary",fontSize:"large"})})})]})]})})},F=function(e){e&&e instanceof Function&&r.e(3).then(r.bind(null,84)).then((function(t){var r=t.getCLS,n=t.getFID,a=t.getFCP,o=t.getLCP,i=t.getTTFB;r(e),n(e),a(e),o(e),i(e)}))};i.a.render(Object(L.jsx)(a.a.StrictMode,{children:Object(L.jsx)(R,{})}),document.getElementById("application-view-root")),F()}},[[61,1,2]]]);
//# sourceMappingURL=main.65f10003.chunk.js.map