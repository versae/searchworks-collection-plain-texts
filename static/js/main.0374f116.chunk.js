(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{103:function(t,e){},105:function(t,e){},106:function(t,e){},107:function(t,e){},108:function(t,e){},111:function(t,e){},113:function(t,e){},18:function(t,e){function n(t){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}n.keys=function(){return[]},n.resolve=n,t.exports=n,n.id=18},181:function(t,e,n){},183:function(t,e,n){"use strict";n.r(e);var a=n(0),o=n.n(a),c=n(76),s=n.n(c),r=(n(93),n(85)),l=n(12),i=n(4),u=n(77),d=n(78),p=n(86),h=n(79),f=n(87),m=n(5),b=n(14),g=n(34),w=n.n(g),j=n(80),O=n.n(j),v=n(81),k=n.n(v),y=n(82),E=n.n(y),x=n(83),D=n.n(x),T=n(84),C=n.n(T),F=(n(181),"https://cors-anywhere.herokuapp.com/");w.a.GlobalWorkerOptions.workerSrc="//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.943/pdf.worker.js";var S=function(t){function e(t){var n;return Object(u.a)(this,e),(n=Object(p.a)(this,Object(h.a)(e).call(this,t))).state={zips:{},status:{},progress:null},n.maxDownloadFiles=10,n.input=o.a.createRef(),n.addTextToZip=n.addTextToZip.bind(Object(m.a)(Object(m.a)(n))),n.downloadZip=n.downloadZip.bind(Object(m.a)(Object(m.a)(n))),n.handleTryOnClick=n.handleTryOnClick.bind(Object(m.a)(Object(m.a)(n))),n.handleDownloadOnClick=n.handleDownloadOnClick.bind(Object(m.a)(Object(m.a)(n))),n}return Object(f.a)(e,t),Object(d.a)(e,[{key:"handleTryOnClick",value:function(){this.input.current.value="https://purl.stanford.edu/jt466yc7169"}},{key:"handleDownloadOnClick",value:function(){var t,e,n=this,a=this.input.current.value,o=Object(b.parse)(a),c=o.hostname,s=o.path;["purl.stanford.edu","searchworks.stanford.edu"].includes(c)&&(this.setState({progress:0,status:Object(i.a)({},[a],"Downloading collection...")}),"purl.stanford.edu"===c?(t=s.slice(1),e="https://searchworks.stanford.edu/catalog.json?f%5Bcollection%5D%5B%5D=".concat(t,"&per_page=").concat(this.maxDownloadFiles)):a.indexOf("searchworks.stanford.edu/catalog.atom")>=0?(t=a.replace("catalog.atom","catalog.json"),e="".concat(t,"&per_page=").concat(this.maxDownloadFiles)):a.indexOf("searchworks.stanford.edu/catalog?")>=0&&(t=a.replace("catalog?","catalog.json?"),e="".concat(t,"&per_page=").concat(this.maxDownloadFiles)),fetch("".concat(F).concat(e),{method:"GET"}).then(function(t){return n.setState({progress:0}),t.json()}).then(function(t){return t.response.docs.flatMap(function(t){return"".concat(t.url_fulltext,"/iiif/manifest")})}).then(function(e){n.setState({status:Object(i.a)({},[a],"Downloading contents...")}),e.forEach(function(e){n.retrieveManifest(t,e)})}),this.input.current.value="")}},{key:"downloadZip",value:function(t){this.state.zips[t].generateAsync({type:"blob"}).then(function(e){k()(e,"".concat(t,".zip"))},function(t){console.log(t)})}},{key:"addTextToZip",value:function(t,e,n){var a=this;this.setState({zips:Object(l.a)(Object(i.a)({},[t],new O.a),this.state.zips),status:Object(l.a)({},this.state.status,Object(i.a)({},[e],"Adding to zip..."))}),Promise.all(n.map(function(t){return t.catch(function(t){return t})})).then(function(n){var o=n.join(" ");a.setState({progress:a.state.progress+1}),a.state.zips[t].file("".concat(e,".txt"),o),a.setState({status:Object(l.a)({},a.state.status,Object(i.a)({},[e],"Done"))}),a.state.progress===a.maxDownloadFiles&&(a.downloadZip(t),a.setState({progress:null,status:{}}))}).catch(function(t){return console.log(t)})}},{key:"retrieveManifest",value:function(t,e){var n,a=this;(n=e,fetch("".concat(F).concat(n),{method:"GET"}).then(function(t){return t.json()}).then(function(t){return D.a.create(t).getSequences().map(function(t){return t.getRenderings().map(function(t){return{label:t.options.resource.__jsonld.label,uri:t.id}})})}).then(E.a)).then(function(e){return e.map(function(e){var n=w.a.getDocument("".concat(F).concat(e.uri));return n.onProgress=function(t){var n=t.loaded;t.total;a.setState({status:Object(l.a)({},a.state.status,Object(i.a)({},[e.label],function(t){var e=Math.log(t)/Math.log(1e3)|0;return+(t/Math.pow(1e3,e)).toFixed(2)+" "+("kMGTPEZY"[e-1]||"")+"B"}(n)))})},n.then(function(n){var o=Object(r.a)(Array(n._pdfInfo.numPages).keys()).map(function(t){return a.setState({status:Object(l.a)({},a.state.status,Object(i.a)({},[e.label],"Extractig page ".concat(t+1)))}),n.getPage(t+1).then(function(t){return t.getTextContent().then(function(t){return t.items.map(function(t){return t.str}).join(" ")})})});a.addTextToZip(t,e.label,o)})})}).then(function(t){0===t.length&&a.setState({status:Object(l.a)({},a.state.status,Object(i.a)({},[e],"No PDFs found"))})})}},{key:"render",value:function(){var t=this,e=null!==this.state.progress&&this.state.progress!==this.maxDownloadFiles?o.a.createElement("progress",{min:0,max:this.maxDownloadFiles,value:this.state.progress}):"",n=Object.keys(this.state.status).map(function(e,n){return[o.a.createElement("dt",{key:"dd".concat(n)},e),o.a.createElement("dd",null,t.state.status[e])]}),a=Object.keys(this.state.zips).map(function(e){return o.a.createElement("li",null,"Download ",o.a.createElement("button",{href:"#",onClick:function(){return t.downloadZip(e)}},e,".zip"))});return o.a.createElement("div",{className:"App"},o.a.createElement("header",{className:"App-header"},o.a.createElement("img",{src:C.a,className:"App-logo",alt:"logo"}),o.a.createElement("p",null,"To download the available plain texts of a IIIF catalog collection containing PDF files,",o.a.createElement("br",null),"enter its URL and click on Download (only the first ~",this.maxDownloadFiles," items will be retrieved)"),o.a.createElement("p",null,o.a.createElement("input",{type:"text",ref:this.input,placeholder:"https://purl.stanford.edu/jt466yc7169"}),o.a.createElement("input",{type:"submit",onClick:this.handleDownloadOnClick,value:"Download"}),o.a.createElement("br",null),o.a.createElement("small",null,"Try the ",o.a.createElement("button",{href:"#",onClick:this.handleTryOnClick},"Jarndyce Single-Volume Nineteenth-Century Novel Collection, 1823-1914"),".")),o.a.createElement("div",null,e,o.a.createElement("dl",null,n),o.a.createElement("ul",null,a))))}}]),e}(a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(o.a.createElement(S,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(t){t.unregister()})},84:function(t,e,n){t.exports=n.p+"static/media/logo.1e0f9ac8.svg"},88:function(t,e,n){t.exports=n(183)},93:function(t,e,n){}},[[88,2,1]]]);
//# sourceMappingURL=main.0374f116.chunk.js.map