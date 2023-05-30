var ke=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function Ee(F){return F&&F.__esModule&&Object.prototype.hasOwnProperty.call(F,"default")?F.default:F}var ye={exports:{}};/* @license
Papa Parse
v5.4.1
https://github.com/mholt/PapaParse
License: MIT
*/(function(F,oe){(function($,p){F.exports=p()})(ke,function $(){var p=typeof self<"u"?self:typeof window<"u"?window:p!==void 0?p:{},M=!p.document&&!!p.postMessage,ie=p.IS_PAPA_WORKER||!1,te={},se=0,h={parse:function(t,e){var r=(e=e||{}).dynamicTyping||!1;if(g(r)&&(e.dynamicTypingFunction=r,r={}),e.dynamicTyping=r,e.transform=!!g(e.transform)&&e.transform,e.worker&&h.WORKERS_SUPPORTED){var n=function(){if(!h.WORKERS_SUPPORTED)return!1;var l=(T=p.URL||p.webkitURL||null,E=$.toString(),h.BLOB_URL||(h.BLOB_URL=T.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ","(",E,")();"],{type:"text/javascript"})))),f=new p.Worker(l),T,E;return f.onmessage=ve,f.id=se++,te[f.id]=f}();return n.userStep=e.step,n.userChunk=e.chunk,n.userComplete=e.complete,n.userError=e.error,e.step=g(e.step),e.chunk=g(e.chunk),e.complete=g(e.complete),e.error=g(e.error),delete e.worker,void n.postMessage({input:t,config:e,workerId:n.id})}var s=null;return h.NODE_STREAM_INPUT,typeof t=="string"?(t=function(l){return l.charCodeAt(0)===65279?l.slice(1):l}(t),s=e.download?new G(e):new B(e)):t.readable===!0&&g(t.read)&&g(t.on)?s=new he(e):(p.File&&t instanceof File||t instanceof Object)&&(s=new Z(e)),s.stream(t)},unparse:function(t,e){var r=!1,n=!0,s=",",l=`\r
`,f='"',T=f+f,E=!1,a=null,C=!1;(function(){if(typeof e=="object"){if(typeof e.delimiter!="string"||h.BAD_DELIMITERS.filter(function(i){return e.delimiter.indexOf(i)!==-1}).length||(s=e.delimiter),(typeof e.quotes=="boolean"||typeof e.quotes=="function"||Array.isArray(e.quotes))&&(r=e.quotes),typeof e.skipEmptyLines!="boolean"&&typeof e.skipEmptyLines!="string"||(E=e.skipEmptyLines),typeof e.newline=="string"&&(l=e.newline),typeof e.quoteChar=="string"&&(f=e.quoteChar),typeof e.header=="boolean"&&(n=e.header),Array.isArray(e.columns)){if(e.columns.length===0)throw new Error("Option columns is empty");a=e.columns}e.escapeChar!==void 0&&(T=e.escapeChar+f),(typeof e.escapeFormulae=="boolean"||e.escapeFormulae instanceof RegExp)&&(C=e.escapeFormulae instanceof RegExp?e.escapeFormulae:/^[=+\-@\t\r].*$/)}})();var u=new RegExp(ue(f),"g");if(typeof t=="string"&&(t=JSON.parse(t)),Array.isArray(t)){if(!t.length||Array.isArray(t[0]))return N(null,t,E);if(typeof t[0]=="object")return N(a||Object.keys(t[0]),t,E)}else if(typeof t=="object")return typeof t.data=="string"&&(t.data=JSON.parse(t.data)),Array.isArray(t.data)&&(t.fields||(t.fields=t.meta&&t.meta.fields||a),t.fields||(t.fields=Array.isArray(t.data[0])?t.fields:typeof t.data[0]=="object"?Object.keys(t.data[0]):[]),Array.isArray(t.data[0])||typeof t.data[0]=="object"||(t.data=[t.data])),N(t.fields||[],t.data||[],E);throw new Error("Unable to serialize unrecognized input");function N(i,y,D){var b="";typeof i=="string"&&(i=JSON.parse(i)),typeof y=="string"&&(y=JSON.parse(y));var S=Array.isArray(i)&&0<i.length,x=!Array.isArray(y[0]);if(S&&n){for(var I=0;I<i.length;I++)0<I&&(b+=s),b+=A(i[I],I);0<y.length&&(b+=l)}for(var o=0;o<y.length;o++){var d=S?i.length:y[o].length,v=!1,O=S?Object.keys(y[o]).length===0:y[o].length===0;if(D&&!S&&(v=D==="greedy"?y[o].join("").trim()==="":y[o].length===1&&y[o][0].length===0),D==="greedy"&&S){for(var _=[],L=0;L<d;L++){var w=x?i[L]:L;_.push(y[o][w])}v=_.join("").trim()===""}if(!v){for(var m=0;m<d;m++){0<m&&!O&&(b+=s);var K=S&&x?i[m]:m;b+=A(y[o][K],m)}o<y.length-1&&(!D||0<d&&!O)&&(b+=l)}}return b}function A(i,y){if(i==null)return"";if(i.constructor===Date)return JSON.stringify(i).slice(1,25);var D=!1;C&&typeof i=="string"&&C.test(i)&&(i="'"+i,D=!0);var b=i.toString().replace(u,T);return(D=D||r===!0||typeof r=="function"&&r(i,y)||Array.isArray(r)&&r[y]||function(S,x){for(var I=0;I<x.length;I++)if(-1<S.indexOf(x[I]))return!0;return!1}(b,h.BAD_DELIMITERS)||-1<b.indexOf(s)||b.charAt(0)===" "||b.charAt(b.length-1)===" ")?f+b+f:b}}};if(h.RECORD_SEP=String.fromCharCode(30),h.UNIT_SEP=String.fromCharCode(31),h.BYTE_ORDER_MARK="\uFEFF",h.BAD_DELIMITERS=["\r",`
`,'"',h.BYTE_ORDER_MARK],h.WORKERS_SUPPORTED=!M&&!!p.Worker,h.NODE_STREAM_INPUT=1,h.LocalChunkSize=10485760,h.RemoteChunkSize=5242880,h.DefaultDelimiter=",",h.Parser=fe,h.ParserHandle=pe,h.NetworkStreamer=G,h.FileStreamer=Z,h.StringStreamer=B,h.ReadableStreamStreamer=he,p.jQuery){var W=p.jQuery;W.fn.parse=function(t){var e=t.config||{},r=[];return this.each(function(l){if(!(W(this).prop("tagName").toUpperCase()==="INPUT"&&W(this).attr("type").toLowerCase()==="file"&&p.FileReader)||!this.files||this.files.length===0)return!0;for(var f=0;f<this.files.length;f++)r.push({file:this.files[f],inputElem:this,instanceConfig:W.extend({},e)})}),n(),this;function n(){if(r.length!==0){var l,f,T,E,a=r[0];if(g(t.before)){var C=t.before(a.file,a.inputElem);if(typeof C=="object"){if(C.action==="abort")return l="AbortError",f=a.file,T=a.inputElem,E=C.reason,void(g(t.error)&&t.error({name:l},f,T,E));if(C.action==="skip")return void s();typeof C.config=="object"&&(a.instanceConfig=W.extend(a.instanceConfig,C.config))}else if(C==="skip")return void s()}var u=a.instanceConfig.complete;a.instanceConfig.complete=function(N){g(u)&&u(N,a.file,a.inputElem),s()},h.parse(a.file,a.instanceConfig)}else g(t.complete)&&t.complete()}function s(){r.splice(0,1),n()}}}function z(t){this._handle=null,this._finished=!1,this._completed=!1,this._halted=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},function(e){var r=de(e);r.chunkSize=parseInt(r.chunkSize),e.step||e.chunk||(r.chunkSize=null),this._handle=new pe(r),(this._handle.streamer=this)._config=r}.call(this,t),this.parseChunk=function(e,r){if(this.isFirstChunk&&g(this._config.beforeFirstChunk)){var n=this._config.beforeFirstChunk(e);n!==void 0&&(e=n)}this.isFirstChunk=!1,this._halted=!1;var s=this._partialLine+e;this._partialLine="";var l=this._handle.parse(s,this._baseIndex,!this._finished);if(!this._handle.paused()&&!this._handle.aborted()){var f=l.meta.cursor;this._finished||(this._partialLine=s.substring(f-this._baseIndex),this._baseIndex=f),l&&l.data&&(this._rowCount+=l.data.length);var T=this._finished||this._config.preview&&this._rowCount>=this._config.preview;if(ie)p.postMessage({results:l,workerId:h.WORKER_ID,finished:T});else if(g(this._config.chunk)&&!r){if(this._config.chunk(l,this._handle),this._handle.paused()||this._handle.aborted())return void(this._halted=!0);l=void 0,this._completeResults=void 0}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(l.data),this._completeResults.errors=this._completeResults.errors.concat(l.errors),this._completeResults.meta=l.meta),this._completed||!T||!g(this._config.complete)||l&&l.meta.aborted||(this._config.complete(this._completeResults,this._input),this._completed=!0),T||l&&l.meta.paused||this._nextChunk(),l}this._halted=!0},this._sendError=function(e){g(this._config.error)?this._config.error(e):ie&&this._config.error&&p.postMessage({workerId:h.WORKER_ID,error:e,finished:!1})}}function G(t){var e;(t=t||{}).chunkSize||(t.chunkSize=h.RemoteChunkSize),z.call(this,t),this._nextChunk=M?function(){this._readChunk(),this._chunkLoaded()}:function(){this._readChunk()},this.stream=function(r){this._input=r,this._nextChunk()},this._readChunk=function(){if(this._finished)this._chunkLoaded();else{if(e=new XMLHttpRequest,this._config.withCredentials&&(e.withCredentials=this._config.withCredentials),M||(e.onload=Y(this._chunkLoaded,this),e.onerror=Y(this._chunkError,this)),e.open(this._config.downloadRequestBody?"POST":"GET",this._input,!M),this._config.downloadRequestHeaders){var r=this._config.downloadRequestHeaders;for(var n in r)e.setRequestHeader(n,r[n])}if(this._config.chunkSize){var s=this._start+this._config.chunkSize-1;e.setRequestHeader("Range","bytes="+this._start+"-"+s)}try{e.send(this._config.downloadRequestBody)}catch(l){this._chunkError(l.message)}M&&e.status===0&&this._chunkError()}},this._chunkLoaded=function(){e.readyState===4&&(e.status<200||400<=e.status?this._chunkError():(this._start+=this._config.chunkSize?this._config.chunkSize:e.responseText.length,this._finished=!this._config.chunkSize||this._start>=function(r){var n=r.getResponseHeader("Content-Range");return n===null?-1:parseInt(n.substring(n.lastIndexOf("/")+1))}(e),this.parseChunk(e.responseText)))},this._chunkError=function(r){var n=e.statusText||r;this._sendError(new Error(n))}}function Z(t){var e,r;(t=t||{}).chunkSize||(t.chunkSize=h.LocalChunkSize),z.call(this,t);var n=typeof FileReader<"u";this.stream=function(s){this._input=s,r=s.slice||s.webkitSlice||s.mozSlice,n?((e=new FileReader).onload=Y(this._chunkLoaded,this),e.onerror=Y(this._chunkError,this)):e=new FileReaderSync,this._nextChunk()},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk()},this._readChunk=function(){var s=this._input;if(this._config.chunkSize){var l=Math.min(this._start+this._config.chunkSize,this._input.size);s=r.call(s,this._start,l)}var f=e.readAsText(s,this._config.encoding);n||this._chunkLoaded({target:{result:f}})},this._chunkLoaded=function(s){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(s.target.result)},this._chunkError=function(){this._sendError(e.error)}}function B(t){var e;z.call(this,t=t||{}),this.stream=function(r){return e=r,this._nextChunk()},this._nextChunk=function(){if(!this._finished){var r,n=this._config.chunkSize;return n?(r=e.substring(0,n),e=e.substring(n)):(r=e,e=""),this._finished=!e,this.parseChunk(r)}}}function he(t){z.call(this,t=t||{});var e=[],r=!0,n=!1;this.pause=function(){z.prototype.pause.apply(this,arguments),this._input.pause()},this.resume=function(){z.prototype.resume.apply(this,arguments),this._input.resume()},this.stream=function(s){this._input=s,this._input.on("data",this._streamData),this._input.on("end",this._streamEnd),this._input.on("error",this._streamError)},this._checkIsFinished=function(){n&&e.length===1&&(this._finished=!0)},this._nextChunk=function(){this._checkIsFinished(),e.length?this.parseChunk(e.shift()):r=!0},this._streamData=Y(function(s){try{e.push(typeof s=="string"?s:s.toString(this._config.encoding)),r&&(r=!1,this._checkIsFinished(),this.parseChunk(e.shift()))}catch(l){this._streamError(l)}},this),this._streamError=Y(function(s){this._streamCleanUp(),this._sendError(s)},this),this._streamEnd=Y(function(){this._streamCleanUp(),n=!0,this._streamData("")},this),this._streamCleanUp=Y(function(){this._input.removeListener("data",this._streamData),this._input.removeListener("end",this._streamEnd),this._input.removeListener("error",this._streamError)},this)}function pe(t){var e,r,n,s=Math.pow(2,53),l=-s,f=/^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/,T=/^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/,E=this,a=0,C=0,u=!1,N=!1,A=[],i={data:[],errors:[],meta:{}};if(g(t.step)){var y=t.step;t.step=function(o){if(i=o,S())b();else{if(b(),i.data.length===0)return;a+=o.data.length,t.preview&&a>t.preview?r.abort():(i.data=i.data[0],y(i,E))}}}function D(o){return t.skipEmptyLines==="greedy"?o.join("").trim()==="":o.length===1&&o[0].length===0}function b(){return i&&n&&(I("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+h.DefaultDelimiter+"'"),n=!1),t.skipEmptyLines&&(i.data=i.data.filter(function(o){return!D(o)})),S()&&function(){if(!i)return;function o(v,O){g(t.transformHeader)&&(v=t.transformHeader(v,O)),A.push(v)}if(Array.isArray(i.data[0])){for(var d=0;S()&&d<i.data.length;d++)i.data[d].forEach(o);i.data.splice(0,1)}else i.data.forEach(o)}(),function(){if(!i||!t.header&&!t.dynamicTyping&&!t.transform)return i;function o(v,O){var _,L=t.header?{}:[];for(_=0;_<v.length;_++){var w=_,m=v[_];t.header&&(w=_>=A.length?"__parsed_extra":A[_]),t.transform&&(m=t.transform(m,w)),m=x(w,m),w==="__parsed_extra"?(L[w]=L[w]||[],L[w].push(m)):L[w]=m}return t.header&&(_>A.length?I("FieldMismatch","TooManyFields","Too many fields: expected "+A.length+" fields but parsed "+_,C+O):_<A.length&&I("FieldMismatch","TooFewFields","Too few fields: expected "+A.length+" fields but parsed "+_,C+O)),L}var d=1;return!i.data.length||Array.isArray(i.data[0])?(i.data=i.data.map(o),d=i.data.length):i.data=o(i.data,0),t.header&&i.meta&&(i.meta.fields=A),C+=d,i}()}function S(){return t.header&&A.length===0}function x(o,d){return v=o,t.dynamicTypingFunction&&t.dynamicTyping[v]===void 0&&(t.dynamicTyping[v]=t.dynamicTypingFunction(v)),(t.dynamicTyping[v]||t.dynamicTyping)===!0?d==="true"||d==="TRUE"||d!=="false"&&d!=="FALSE"&&(function(O){if(f.test(O)){var _=parseFloat(O);if(l<_&&_<s)return!0}return!1}(d)?parseFloat(d):T.test(d)?new Date(d):d===""?null:d):d;var v}function I(o,d,v,O){var _={type:o,code:d,message:v};O!==void 0&&(_.row=O),i.errors.push(_)}this.parse=function(o,d,v){var O=t.quoteChar||'"';if(t.newline||(t.newline=function(w,m){w=w.substring(0,1048576);var K=new RegExp(ue(m)+"([^]*?)"+ue(m),"gm"),P=(w=w.replace(K,"")).split("\r"),H=w.split(`
`),Q=1<H.length&&H[0].length<P[0].length;if(P.length===1||Q)return`
`;for(var U=0,k=0;k<P.length;k++)P[k][0]===`
`&&U++;return U>=P.length/2?`\r
`:"\r"}(o,O)),n=!1,t.delimiter)g(t.delimiter)&&(t.delimiter=t.delimiter(o),i.meta.delimiter=t.delimiter);else{var _=function(w,m,K,P,H){var Q,U,k,R;H=H||[",","	","|",";",h.RECORD_SEP,h.UNIT_SEP];for(var re=0;re<H.length;re++){var c=H[re],ae=0,J=0,ne=0;k=void 0;for(var V=new fe({comments:P,delimiter:c,newline:m,preview:10}).parse(w),X=0;X<V.data.length;X++)if(K&&D(V.data[X]))ne++;else{var ee=V.data[X].length;J+=ee,k!==void 0?0<ee&&(ae+=Math.abs(ee-k),k=ee):k=ee}0<V.data.length&&(J/=V.data.length-ne),(U===void 0||ae<=U)&&(R===void 0||R<J)&&1.99<J&&(U=ae,Q=c,R=J)}return{successful:!!(t.delimiter=Q),bestDelimiter:Q}}(o,t.newline,t.skipEmptyLines,t.comments,t.delimitersToGuess);_.successful?t.delimiter=_.bestDelimiter:(n=!0,t.delimiter=h.DefaultDelimiter),i.meta.delimiter=t.delimiter}var L=de(t);return t.preview&&t.header&&L.preview++,e=o,r=new fe(L),i=r.parse(e,d,v),b(),u?{meta:{paused:!0}}:i||{meta:{paused:!1}}},this.paused=function(){return u},this.pause=function(){u=!0,r.abort(),e=g(t.chunk)?"":e.substring(r.getCharIndex())},this.resume=function(){E.streamer._halted?(u=!1,E.streamer.parseChunk(e,!0)):setTimeout(E.resume,3)},this.aborted=function(){return N},this.abort=function(){N=!0,r.abort(),i.meta.aborted=!0,g(t.complete)&&t.complete(i),e=""}}function ue(t){return t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function fe(t){var e,r=(t=t||{}).delimiter,n=t.newline,s=t.comments,l=t.step,f=t.preview,T=t.fastMode,E=e=t.quoteChar===void 0||t.quoteChar===null?'"':t.quoteChar;if(t.escapeChar!==void 0&&(E=t.escapeChar),(typeof r!="string"||-1<h.BAD_DELIMITERS.indexOf(r))&&(r=","),s===r)throw new Error("Comment character same as delimiter");s===!0?s="#":(typeof s!="string"||-1<h.BAD_DELIMITERS.indexOf(s))&&(s=!1),n!==`
`&&n!=="\r"&&n!==`\r
`&&(n=`
`);var a=0,C=!1;this.parse=function(u,N,A){if(typeof u!="string")throw new Error("Input must be a string");var i=u.length,y=r.length,D=n.length,b=s.length,S=g(l),x=[],I=[],o=[],d=a=0;if(!u)return q();if(t.header&&!N){var v=u.split(n)[0].split(r),O=[],_={},L=!1;for(var w in v){var m=v[w];g(t.transformHeader)&&(m=t.transformHeader(m,w));var K=m,P=_[m]||0;for(0<P&&(L=!0,K=m+"_"+P),_[m]=P+1;O.includes(K);)K=K+"_"+P;O.push(K)}if(L){var H=u.split(n);H[0]=O.join(r),u=H.join(n)}}if(T||T!==!1&&u.indexOf(e)===-1){for(var Q=u.split(n),U=0;U<Q.length;U++){if(o=Q[U],a+=o.length,U!==Q.length-1)a+=n.length;else if(A)return q();if(!s||o.substring(0,b)!==s){if(S){if(x=[],ne(o.split(r)),le(),C)return q()}else ne(o.split(r));if(f&&f<=U)return x=x.slice(0,f),q(!0)}}return q()}for(var k=u.indexOf(r,a),R=u.indexOf(n,a),re=new RegExp(ue(E)+ue(e),"g"),c=u.indexOf(e,a);;)if(u[a]!==e)if(s&&o.length===0&&u.substring(a,a+b)===s){if(R===-1)return q();a=R+D,R=u.indexOf(n,a),k=u.indexOf(r,a)}else if(k!==-1&&(k<R||R===-1))o.push(u.substring(a,k)),a=k+y,k=u.indexOf(r,a);else{if(R===-1)break;if(o.push(u.substring(a,R)),ee(R+D),S&&(le(),C))return q();if(f&&x.length>=f)return q(!0)}else for(c=a,a++;;){if((c=u.indexOf(e,c+1))===-1)return A||I.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:x.length,index:a}),X();if(c===i-1)return X(u.substring(a,c).replace(re,e));if(e!==E||u[c+1]!==E){if(e===E||c===0||u[c-1]!==E){k!==-1&&k<c+1&&(k=u.indexOf(r,c+1)),R!==-1&&R<c+1&&(R=u.indexOf(n,c+1));var ae=V(R===-1?k:Math.min(k,R));if(u.substr(c+1+ae,y)===r){o.push(u.substring(a,c).replace(re,e)),u[a=c+1+ae+y]!==e&&(c=u.indexOf(e,a)),k=u.indexOf(r,a),R=u.indexOf(n,a);break}var J=V(R);if(u.substring(c+1+J,c+1+J+D)===n){if(o.push(u.substring(a,c).replace(re,e)),ee(c+1+J+D),k=u.indexOf(r,a),c=u.indexOf(e,a),S&&(le(),C))return q();if(f&&x.length>=f)return q(!0);break}I.push({type:"Quotes",code:"InvalidQuotes",message:"Trailing quote on quoted field is malformed",row:x.length,index:a}),c++}}else c++}return X();function ne(j){x.push(j),d=a}function V(j){var me=0;if(j!==-1){var ce=u.substring(c+1,j);ce&&ce.trim()===""&&(me=ce.length)}return me}function X(j){return A||(j===void 0&&(j=u.substring(a)),o.push(j),a=i,ne(o),S&&le()),q()}function ee(j){a=j,ne(o),o=[],R=u.indexOf(n,a)}function q(j){return{data:x,errors:I,meta:{delimiter:r,linebreak:n,aborted:C,truncated:!!j,cursor:d+(N||0)}}}function le(){l(q()),x=[],I=[]}},this.abort=function(){C=!0},this.getCharIndex=function(){return a}}function ve(t){var e=t.data,r=te[e.workerId],n=!1;if(e.error)r.userError(e.error,e.file);else if(e.results&&e.results.data){var s={abort:function(){n=!0,ge(e.workerId,{data:[],errors:[],meta:{aborted:!0}})},pause:_e,resume:_e};if(g(r.userStep)){for(var l=0;l<e.results.data.length&&(r.userStep({data:e.results.data[l],errors:e.results.errors,meta:e.results.meta},s),!n);l++);delete e.results}else g(r.userChunk)&&(r.userChunk(e.results,s,e.file),delete e.results)}e.finished&&!n&&ge(e.workerId,e.results)}function ge(t,e){var r=te[t];g(r.userComplete)&&r.userComplete(e),r.terminate(),delete te[t]}function _e(){throw new Error("Not implemented.")}function de(t){if(typeof t!="object"||t===null)return t;var e=Array.isArray(t)?[]:{};for(var r in t)e[r]=de(t[r]);return e}function Y(t,e){return function(){t.apply(e,arguments)}}function g(t){return typeof t=="function"}return ie&&(p.onmessage=function(t){var e=t.data;if(h.WORKER_ID===void 0&&e&&(h.WORKER_ID=e.workerId),typeof e.input=="string")p.postMessage({workerId:h.WORKER_ID,results:h.parse(e.input,e.config),finished:!0});else if(p.File&&e.input instanceof File||e.input instanceof Object){var r=h.parse(e.input,e.config);r&&p.postMessage({workerId:h.WORKER_ID,results:r,finished:!0})}}),(G.prototype=Object.create(z.prototype)).constructor=G,(Z.prototype=Object.create(z.prototype)).constructor=Z,(B.prototype=Object.create(B.prototype)).constructor=B,(he.prototype=Object.create(z.prototype)).constructor=he,h})})(ye);var be=ye.exports;const Ce=Ee(be);function we(){return localStorage.getItem("language")?(localStorage.getItem("language")==="en"&&document.getElementById("language-select").options[1].setAttribute("selected",!0),localStorage.getItem("language")):"fr"}const Re=()=>{const oe=we()==="fr"?"./documents/csv/listeFR.csv":"./documents/csv/listeENG.csv";return new Promise(($,p)=>{Ce.parse(oe,{download:!0,delimiter:"",header:!0,complete:function(M){$(M.data)},error:function(M){p(M)}})})};Re().then(F=>{const oe=document.getElementById("table-container");if(oe){const $=document.createElement("table"),p=document.createElement("thead"),M=document.createElement("tr"),ie=Object.keys(F[0]);ie.forEach(se=>{const h=document.createElement("th");h.textContent=se,M.appendChild(h)}),p.appendChild(M),$.appendChild(p);const te=document.createElement("tbody");Object.values(F).forEach(se=>{if(!Object.values(se).every(W=>W==="")){const W=document.createElement("tr");ie.forEach(z=>{const G=document.createElement("td"),Z=se[z];if(z==="URL vers la fiche DEDuCT"||z==="URL to the DEDuCT page"){const B=document.createElement("a");B.href=Z,B.target="_blank",B.classList.add("external"),B.textContent=Z,G.appendChild(B)}else G.textContent=Z;W.appendChild(G)}),te.appendChild(W)}}),$.appendChild(te),oe.appendChild($)}}).catch(F=>{console.error(F)});
//# sourceMappingURL=readcsv-85c4e0a3.js.map