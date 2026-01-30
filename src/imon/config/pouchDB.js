//import * as PouchDB from 'pouchdb';
//const PouchDB = require('pouchdb');
//const PouchDB = require('pouchdb-browser');
//const pouchDB = PouchDB.default.defaults();
import { createStore } from 'redux';
import { useSelector } from 'react-redux';
import configureStore from '../redux/store/configureStore';
import reducer from '../redux/reducers/appReducer';
import AesUtil from "../encryption/AESUtil";
const PouchDB = require('pouchdb').default;
PouchDB.plugin(require('pouchdb-adapter-cordova-sqlite'));
PouchDB.plugin(require('transform-pouch'));
PouchDB.plugin(require('crypto-pouch'));
const crypto = require('crypto');
var decrypt = require('native-crypto/decrypt');
var chacha = require('chacha');
var CryptoJS = require("crypto-js");
const store = createStore(reducer);
var aesUtil = new AesUtil(256, 1000);


class OffileDbClass {

  constructor() {
    this.password = 'oneImpactDb@123'
    this.crpyKey = null
    this.dbInstanc = null;
    this.store = store.getState();
    this.dbId = store.getState().communityId;
  }

  setDatabase() {
    var that = this;
    if (!window.cordova) {
      this.dbInstanc = new PouchDB('oneImpactDb');
      console.log('database is set')
      this.applytransform()
      //this.dbInstanc.crypto(this.password);
      //this.getCrptoKey()
    } else {
      document.addEventListener('deviceready', function () {
        that.dbInstanc = new PouchDB('database.db', {
          adapter: 'cordova-sqlite',
          location: 'default'
        });
        //this.dbInstanc.crypto('abcd');
        that.dbInstanc.post({}).then(function (res) {
          console.log('darares', res)
        }).then(function (doc) {
        }).catch(console.log.bind(console));
      });
    }

  }

  applytransform() {
    var that = this
    this.dbInstanc.transform({
      incoming: function (doc) {
        Object.keys(doc).forEach(function (field) {
          if (field !== '_id' && field !== '_rev' && field !== '_revisions') {
            doc[field] = that.encrypt(doc[field]);
          }
        });
        return doc;
      },
      outgoing: function (doc) {
        Object.keys(doc).forEach(function (field) {
          if (field !== '_id' && field !== '_rev' && field !== '_revisions') {
            doc[field] = that.decrypt(doc[field]);
          }
        });
        return doc;
      }
    });
  }


  encrypt(text) {
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(text), this.password).toString();
    return ciphertext
  }

  decrypt(text) {
    if (typeof text != "object") {
      var bytes = CryptoJS.AES.decrypt(text, this.password);
      var originalText = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return originalText
    } else {
      return text;
    }
  }

  setData(setid, data) {
    var that = this;
    var counnityid = localStorage.getItem('CommunityId') != null ? localStorage.getItem('CommunityId') : this.dbId;
    var langId = JSON.parse(localStorage.getItem('langId')) != null ? JSON.parse(localStorage.getItem('langId')) : 1;
    var id = counnityid + '-' + langId + '-' + setid
    this.dbInstanc.get(id).then(function (doc) {
      return that.dbInstanc.put({
        _id: id,
        _rev: doc._rev,
        "data": data
      });
    }).then(function (response) {
    }).catch(function (err) {
      if (err.status == 404) {
        that.dbInstanc.put({
          _id: id,
          "data": data
        });
      }
    });
  }

  getData(getid) {
    var counnityid = localStorage.getItem('CommunityId') != null ? localStorage.getItem('CommunityId') : this.dbId;
    var langId = JSON.parse(localStorage.getItem('langId')) != null ? JSON.parse(localStorage.getItem('langId')) : 1;
    var id = counnityid + '-' + langId + '-' + getid
    var that = this;
    try {
      return this.dbInstanc.get(id).then(function (doc) {
        return doc
      }).catch(function (err) {
        return err
      });
    } catch (err) {
      console.log('geterr', err)
    }
  }

  removeData(rid) {
    var counnityid = localStorage.getItem('CommunityId') != null ? localStorage.getItem('CommunityId') : this.dbId;
    var langId = JSON.parse(localStorage.getItem('langId')) != null ? JSON.parse(localStorage.getItem('langId')) : 1;
    var id = counnityid + '-' + langId + '-' + rid
    var that = this;
    this.dbInstanc.get(id).then(function (doc) {
      that.dbInstanc.remove(doc);
    }).then(function (response) {
      console.log(response)
    }).catch(function (err) {
      console.log(err)
    });
  }

  newremoveData(rid) {
    var counnityid = localStorage.getItem('CommunityId') != null ? localStorage.getItem('CommunityId') : this.dbId;
    var langId = JSON.parse(localStorage.getItem('langId')) != null ? JSON.parse(localStorage.getItem('langId')) : 1;
    var id = counnityid + '-' + langId + '-' + rid
    var that = this;
    return this.dbInstanc.get(id).then(function (doc) {
      return that.dbInstanc.remove(doc);
    }).then(function (response) {
      console.log(response)
      return response
    }).catch(function (err) {
      return err
    });
  }

  deleteDatabse() {
    var that = this;
    if(this.dbInstanc){
      this.dbInstanc.destroy().then(function (response) {
        that.setDatabase()
      }).catch(function (err) {
        console.log(err);
      });
    }
  }

  // getCrptoKey() {
  //   var that = this;
  //   this.dbInstanc.get('_local/crypto').then(function (doc) {
  //     console.log(doc)
  //     return new Promise(function (resolve, reject) {
  //       crypto.pbkdf2(that.password, doc.salt, doc.iterations, 256 / 8, doc.digest, function (err, key) {
  //         if (err) {
  //           console.log(err)
  //           return reject(err);
  //         }
  //         resolve(key);
  //       });
  //     });
  //   }).then(function (key) {
  //     console.log(key)
  //     that.crpyKey = key;
  //   });
  // }

}


const OffileDb = new OffileDbClass();
export default OffileDb;