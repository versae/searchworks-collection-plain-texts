import { parse as URLParse } from 'url';
import React, { Component } from 'react';

import PdfJsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import saveAs from 'file-saver';

import flat from 'array.prototype.flat';
import Manifesto from 'manifesto.js';

import logo from './logo.svg';
import './App.css';

const PROXY = 'https://cors-anywhere-vanfexfhcx.now.sh/';
const TEST_COLLECTION = 'https://purl.stanford.edu/jt466yc7169';
PdfJsLib.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.943/pdf.worker.js';

const getPDFsFromIIIFManifest = uri => fetch(`${PROXY}${uri}`, { method: 'GET' })
  .then(response => response.json())
  .then(manifest => Manifesto
    .create(manifest)
    .getSequences()
    .map(seq => seq
      .getRenderings()
      .map(rendering => ({
        label: rendering.options.resource.__jsonld.label,
        uri: rendering.id
      }))
    )
  ).then(flat);

const fileSize = size => {
    const e = (Math.log(size) / Math.log(1e3)) | 0;
    return +(size / Math.pow(1e3, e)).toFixed(2) + ' ' + ('kMGTPEZY'[e - 1] || '') + 'B';
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zips: {},
      status: {},
      progress: null
    }
    this.maxDownloadFiles = 10;  // max is limited to 100 by searchworks
    this.input = React.createRef();
    this.addTextToZip = this.addTextToZip.bind(this);
    this.downloadZip = this.downloadZip.bind(this);
    this.handleTryOnClick = this.handleTryOnClick.bind(this);
    this.handleDownloadOnClick = this.handleDownloadOnClick.bind(this);
  }

  handleTryOnClick() {
    this.input.current.value = TEST_COLLECTION;
  }

  handleDownloadOnClick() {
    const url = this.input.current.value;
    const { hostname, path } = URLParse(url);
    if (['purl.stanford.edu', 'searchworks.stanford.edu'].includes(hostname)) {
      this.setState({progress: 0, status: {[[url]]: "Downloading collection..."}});
      let collection;
      let feed;
      if (hostname === 'purl.stanford.edu') {
        collection = path.slice(1);
        feed = `https://searchworks.stanford.edu/catalog.json?f%5Bcollection%5D%5B%5D=${collection}&per_page=${this.maxDownloadFiles}`;
      } else if (url.indexOf("searchworks.stanford.edu/catalog.atom") >= 0) {
        collection = url.replace("catalog.atom", "catalog.json");
        feed = `${collection}&per_page=${this.maxDownloadFiles}`;
      } else if (url.indexOf('searchworks.stanford.edu/catalog?') >= 0) {
        collection = url.replace('catalog?', 'catalog.json?');
        feed = `${collection}&per_page=${this.maxDownloadFiles}`;
      }
      fetch(`${PROXY}${feed}`, { method: 'GET' })
        .then(response => {
          this.setState({progress: 0});
          return response.json();
        })
        .then(jsonFeed => {
          return jsonFeed.response.docs.flatMap(doc => `${doc.url_fulltext}/iiif/manifest`);
        })
        .then(manifests => {
          this.setState({status: {[[url]]: "Downloading contents..."}});
          manifests.forEach(manifest => {
            this.retrieveManifest(collection, manifest);
          })
        });
      this.input.current.value = "";
    }
  }

  downloadZip(label) {
    this.state.zips[label].generateAsync({type: 'blob'}).then(function (blob) {
        saveAs(blob, `${label}.zip`);
    }, function (err) {
        console.log(err);
    });
  }

  addTextToZip(label, filename, texts) {
    this.setState({
      zips: {[[label]]: new JSZip(), ...this.state.zips},
      status: {...this.state.status, [[filename]]: "Adding to zip..."}
    });
    Promise.all(texts.map(promise => promise.catch(err => err)))
    .then(textChunks => {
      const text = textChunks.join(' ');
      this.setState({
        progress: this.state.progress + 1
      });
      this.state.zips[label].file(`${filename}.txt`, text);
      this.setState({
        status: {...this.state.status, [[filename]]: "Done"}
      });
      if (this.state.progress === this.maxDownloadFiles) {
        this.downloadZip(label);
        this.setState({
          progress: null,
          status: {},
        })
      }
    })
    .catch(err => console.log(err));
  }

  retrieveManifest(label, manifestUri) {
    getPDFsFromIIIFManifest(manifestUri).then(pdfFiles => {
      return pdfFiles.map(pdfFile => {
        const pdfDoc = PdfJsLib.getDocument(`${PROXY}${pdfFile.uri}`)
        pdfDoc.onProgress = ({loaded, total}) => {
          this.setState({status: {...this.state.status, [[pdfFile.label]]: fileSize(loaded)}})
        }
        return pdfDoc.then((pdf) => {
          const texts = [...Array(pdf._pdfInfo.numPages).keys()].map(pageNumber => {
            this.setState({status: {...this.state.status, [[pdfFile.label]]: `Extractig page ${pageNumber + 1}`}})
            return pdf.getPage(pageNumber + 1).then(pdfPage => (
              pdfPage.getTextContent().then(textContent => (
                textContent.items.map(text => text.str).join(' ')
              ))
            ))
          });
          this.addTextToZip(label, pdfFile.label, texts);
        });
      })
    }).then(files => {
      if (files.length === 0) {
        this.setState({status: {...this.state.status, [[manifestUri]]: "No PDFs found"}})
      }
    })
  }

  render() {
    const progress = (this.state.progress !== null && this.state.progress !== this.maxDownloadFiles) ? (
      <progress min={0} max={this.maxDownloadFiles} value={this.state.progress} />
    ) : ('');
    const status = Object.keys(
      this.state.status
    ).map((item, idx) => (
      [<dt key={`dt${idx}`}>{item}</dt>, <dd key={`dd${idx}`}>{this.state.status[item]}</dd>]
    ));
    const downloads = Object.keys(this.state.zips).map((zip, idx) => (
      <li key="li{idx}">Download <button href="#" onClick={() => this.downloadZip(zip)}>{zip}.zip</button></li>
    ));
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            To download the available plain texts of a IIIF catalog collection containing PDF files,
            <br />
            enter its URL and click on Download
            (only the first <acronym title="This is only a proof of concept">~{this.maxDownloadFiles} items</acronym> will be retrieved)
          </p>
          <p>
            <input type="text" ref={this.input} placeholder={TEST_COLLECTION} />
            <input type="submit" onClick={this.handleDownloadOnClick} value="Download" />
            <br />
            <small>
              Try the <button href="#" onClick={this.handleTryOnClick}>
                Jarndyce Single-Volume Nineteenth-Century Novel Collection, 1823-1914
              </button>.
            </small>
          </p>
          <div>
            {progress}
            <dl>
              {status}
            </dl>
            <ul>
              {downloads}
            </ul>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
