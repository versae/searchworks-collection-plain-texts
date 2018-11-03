import { parse as URLParse } from "url";
import React, { Component } from 'react';

import PdfJsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import saveAs from 'file-saver';

import flat from 'array.prototype.flat';
import Manifesto from 'manifesto.js';


import logo from './logo.svg';
import './App.css';

PdfJsLib.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.943/pdf.worker.js';

const getPDFsFromIIIFManifest = uri => fetch(uri, { method: 'GET' })
  .then(response => Manifesto
    .create(response.json().data)
    .getSequences()
    .map(seq => seq
      .getRenderings()
      .map(rendering => ({
        label: rendering.options.resource.__jsonld.label,
        uri: rendering.id
      }))
    )
  ).then(flat);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      docs: [],
      progress: null
    }
    this.zip = new JSZip();
    this.maxDownloadFiles = 5;  // max is limited to 100 by searchworks
    this.input = React.createRef();
    this.addTextToZip = this.addTextToZip.bind(this);
    this.downloadZip = this.downloadZip.bind(this);
    this.handleTryOnClick = this.handleTryOnClick.bind(this);
    this.handleDownloadOnClick = this.handleDownloadOnClick.bind(this);
  }

  handleTryOnClick() {
    this.input.current.value = "https://purl.stanford.edu/jt466yc7169";
  }

  handleDownloadOnClick() {
    const url = this.input.current.value;
    const { hostname, path } = URLParse(url);
    if (hostname === "purl.stanford.edu") {
      const proxy = 'https://cors-anywhere.herokuapp.com/';
      const feed = `${proxy}https://searchworks.stanford.edu/catalog.json?f%5Bcollection%5D%5B%5D=${path.slice(1)}&per_page=${this.maxDownloadFiles}`;
      fetch(feed, { method: 'GET' })
        .then(response => {
          this.setState({progress: 0});
          return response.json();
        })
        .then(jsonFeed => {
          return jsonFeed.response.docs.flatMap(doc => `${doc.url_fulltext}/iiif/manifest`);
        })
        .then(manifests => {
          console.log(manifests)
          manifests.forEach(manifest => {
            this.retrieveManifest(manifest);
          })
        });
    }
  }

  downloadZip() {
    console.log(this.state.docs);
    this.zip.generateAsync({type:"blob"}).then(function (blob) {
        saveAs(blob, "collection.zip");
    }, function (err) {
        console.log(err);
    });
  }

  addTextToZip(label, texts) {
    console.log(`${label}\n-------------------`)
    Promise.all(texts.map(promise => promise.catch(err => err)))
    .then(textChunks => {
      const text = textChunks.join(" ");
      this.setState({
        docs: [{label, text}, ...this.state.docs],
        progress: this.state.progress + 1
      });
      this.zip.file(`${label}.txt`, text);
      if (this.state.progress === this.maxDownloadFiles) {
        this.downloadZip();
      }
    })
    .catch(e => console.log(e));
  }

  retrieveManifest(manifestUri) {
    getPDFsFromIIIFManifest(manifestUri).then(pdfFiles => {
      pdfFiles.map(pdfFile => {
        PdfJsLib.getDocument(pdfFile.uri).then((pdf) => {
          const texts = [...Array(pdf._pdfInfo.numPages).keys()].map(pageNumber => (
            pdf.getPage(pageNumber + 1).then(pdfPage => (
              pdfPage.getTextContent().then(textContent => (
                textContent.items.map(text => text.str).join(" ")
              ))
            ))
          ));
          this.addTextToZip(pdfFile.label, texts);
        });
      })
    })
  }

  render() {
    const progress = (this.state.progress !== null && this.state.progress !== this.maxDownloadFiles ) ? (
      <progress min={0} max={this.maxDownloadFiles} value={this.state.progress} />
    ) : ('');

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            To download the available plain texts of a collection,
            enter its URL and click on Download (only the first {this.maxDownloadFiles} items will be retrieved)
          </p>
          <p>
            <input ref={this.input} />
            <input type="submit" onClick={this.handleDownloadOnClick} value="Download" />
          </p>
          <small>
            Try the <a href="#" onClick={this.handleTryOnClick}>
              Jarndyce Single-Volume Nineteenth-Century Novel Collection, 1823-1914
            </a>.
          </small>
          {progress}
        </header>
      </div>
    );
  }
}

export default App;
