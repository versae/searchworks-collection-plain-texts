(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{101:function(e,n){},103:function(e,n){},104:function(e,n){},105:function(e,n){},106:function(e,n){},109:function(e,n){},111:function(e,n){},16:function(e,n){function t(e){var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}t.keys=function(){return[]},t.resolve=t,e.exports=t,t.id=16},179:function(e,n,t){},181:function(e,n,t){"use strict";t.r(n);var o=t(2),a=t.n(o),i=t(75),c=t.n(i),r=(t(91),t(33)),l=t(76),s=t(77),u=t(84),d=t(78),f=t(85),p=t(4),h=t(12),m=t(32),w=t.n(m),g=t(79),b=t.n(g),v=t(80),k=t.n(v),O=t(81),j=t.n(O),y=t(82),x=t.n(y),T=t(83),D=t.n(T);t(179);w.a.GlobalWorkerOptions.workerSrc="//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.943/pdf.worker.js";var E=function(e){function n(e){var t;return Object(l.a)(this,n),(t=Object(u.a)(this,Object(d.a)(n).call(this,e))).state={docs:[],progress:null},t.zip=new b.a,t.maxDownloadFiles=5,t.input=a.a.createRef(),t.addTextToZip=t.addTextToZip.bind(Object(p.a)(Object(p.a)(t))),t.downloadZip=t.downloadZip.bind(Object(p.a)(Object(p.a)(t))),t.handleTryOnClick=t.handleTryOnClick.bind(Object(p.a)(Object(p.a)(t))),t.handleDownloadOnClick=t.handleDownloadOnClick.bind(Object(p.a)(Object(p.a)(t))),t}return Object(f.a)(n,e),Object(s.a)(n,[{key:"handleTryOnClick",value:function(){this.input.current.value="https://purl.stanford.edu/jt466yc7169"}},{key:"handleDownloadOnClick",value:function(){var e=this,n=this.input.current.value,t=Object(h.parse)(n),o=t.hostname,a=t.path;if("purl.stanford.edu"===o){var i="".concat("https://cors-anywhere.herokuapp.com/","https://searchworks.stanford.edu/catalog.json?f%5Bcollection%5D%5B%5D=").concat(a.slice(1),"&per_page=").concat(this.maxDownloadFiles);fetch(i,{method:"GET"}).then(function(n){return e.setState({progress:0}),n.json()}).then(function(e){return e.response.docs.flatMap(function(e){return"".concat(e.url_fulltext,"/iiif/manifest")})}).then(function(n){console.log(n),n.forEach(function(n){e.retrieveManifest(n)})})}}},{key:"downloadZip",value:function(){console.log(this.state.docs),this.zip.generateAsync({type:"blob"}).then(function(e){k()(e,"collection.zip")},function(e){console.log(e)})}},{key:"addTextToZip",value:function(e,n){var t=this;console.log("".concat(e,"\n-------------------")),Promise.all(n.map(function(e){return e.catch(function(e){return e})})).then(function(n){var o=n.join(" ");t.setState({docs:[{label:e,text:o}].concat(Object(r.a)(t.state.docs)),progress:t.state.progress+1}),t.zip.file("".concat(e,".txt"),o),t.state.progress===t.maxDownloadFiles&&t.downloadZip()}).catch(function(e){return console.log(e)})}},{key:"retrieveManifest",value:function(e){var n,t=this;(n=e,fetch(n,{method:"GET"}).then(function(e){return x.a.create(e.json().data).getSequences().map(function(e){return e.getRenderings().map(function(e){return{label:e.options.resource.__jsonld.label,uri:e.id}})})}).then(j.a)).then(function(e){e.map(function(e){w.a.getDocument(e.uri).then(function(n){var o=Object(r.a)(Array(n._pdfInfo.numPages).keys()).map(function(e){return n.getPage(e+1).then(function(e){return e.getTextContent().then(function(e){return e.items.map(function(e){return e.str}).join(" ")})})});t.addTextToZip(e.label,o)})})})}},{key:"render",value:function(){var e=null!==this.state.progress&&this.state.progress!==this.maxDownloadFiles?a.a.createElement("progress",{min:0,max:this.maxDownloadFiles,value:this.state.progress}):"";return a.a.createElement("div",{className:"App"},a.a.createElement("header",{className:"App-header"},a.a.createElement("img",{src:D.a,className:"App-logo",alt:"logo"}),a.a.createElement("p",null,"To download the available plain texts of a collection, enter its URL and click on Download (only the first ",this.maxDownloadFiles," items will be retrieved)"),a.a.createElement("p",null,a.a.createElement("input",{ref:this.input}),a.a.createElement("input",{type:"submit",onClick:this.handleDownloadOnClick,value:"Download"})),a.a.createElement("small",null,"Try the ",a.a.createElement("a",{href:"#",onClick:this.handleTryOnClick},"Jarndyce Single-Volume Nineteenth-Century Novel Collection, 1823-1914"),"."),e))}}]),n}(o.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(a.a.createElement(E,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},83:function(e,n,t){e.exports=t.p+"static/media/logo.1e0f9ac8.svg"},86:function(e,n,t){e.exports=t(181)},91:function(e,n,t){}},[[86,2,1]]]);
//# sourceMappingURL=main.56b6e75c.chunk.js.map