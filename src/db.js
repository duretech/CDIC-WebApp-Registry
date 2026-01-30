import PouchDB from 'pouchdb'
import { getDatabaseNames } from '../src/config/validationutils'
import { decryptData, encryptData } from './imon/encryption/AesEnc';
import _ from 'lodash';
PouchDB.plugin(require('transform-pouch'));
PouchDB.plugin(require('crypto-pouch'));
var CryptoJS = require("crypto-js");
class OfflineDbClass{
    constructor(){
        this.db = null;
        this.appdb = null;
        this.password = 'Healthworker@123';
        this.crpyKey = null
    }
    setPouchDBDatabase() {
      const configKey = 'appConfign';
      let configRaw = localStorage.getItem(configKey);
  
      if (!configRaw) {
        const sessionConfigRaw = sessionStorage.getItem(configKey);
        localStorage.setItem(configKey, sessionConfigRaw);
        configRaw = sessionConfigRaw;
        const { defaultDB, appDB } = getDatabaseNames("database"); 
        var that = this;
        this.db = new PouchDB(defaultDB);
        this.appdb = new PouchDB(appDB);
        this.applytransform()
      }
      else
      {
      const { defaultDB, appDB } = getDatabaseNames("database"); 
        var that = this;
       // //if (!window.cordova) {
          // this.db = new PouchDB('CDIC_Generic_UI_DB');
          // this.appdb = new PouchDB('CDIC_Generic_APP_DB');
          this.db = new PouchDB(defaultDB);
          this.appdb = new PouchDB(appDB);
          this.applytransform()
        /*} else {
          document.addEventListener('deviceready', function () {
            that.dbInstanc = new PouchDB('database.db', {
              adapter: 'cordova-sqlite',
              location: 'default'
            });
            //this.dbInstanc.crypto('abcd');
            that.dbInstanc.post({}).then(function (res) 
            }).then(function (doc) {
            }).catch();
          });
        }*/
      }
    }

    /* =======================================================
        comman offline data storage functions
      ========================================================
    */

   setDataIntoPouchDB(id, dataobj) {
      var that = this;
      const encryptedData = encryptData(dataobj);
      let newDoc = {_id:id.toString(),data:encryptedData};
      return this.db.get(newDoc._id).then(function (doc) {
        
        newDoc['_rev'] = doc._rev;
        newDoc['force'] = true
        return that.db.put(newDoc).catch(err=>{
        })
      }).catch(function (err) {
        if (err.status == 404) {
          that.db.put(newDoc);
        }
      });
    }
    getDataFromPouchDB(id) {
        try {
          return this.db.get(id).then(function (doc) {
            let tempHolder = _.cloneDeep(doc)
            tempHolder.data = decryptData(tempHolder.data)
            return  tempHolder
          }).catch(function (err) {
            return err
          });
        } catch (err) {
        }
    }

    removeDataFromPouchDB(id) {
        var that = this;
        return this.db.get(id).then(function (doc) {
          return that.db.remove(doc);
        }).then(function (response) {
        }).catch(function (err) {
        });
    }
    deleteDatabse() {
        var that = this;
        return this.db.destroy().then(function (response) {
          //that.setDatabase()
          return response;
        }).catch(function (err) {
        });
    }

    /* =======================================
        Mobile offline data storage functions
      ========================================
    */
    applytransform() {
      var that = this
      this.appdb.transform({
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
      if(typeof text != "object") {
        var bytes = CryptoJS.AES.decrypt(text, this.password);
        var originalText = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return originalText
      } else {
        return text;
      }
    }

    saveEntity(instance){
      return this.appdb.post(instance).then(function (response) {
          return response;
          //callback(response);
      }).catch(function (err) {
          //callback(err);
      });
    }
    
    getSingleEntity(id){
      return this.appdb.get(id).then(function (doc) {
        return doc
      }).catch(function (err) {
        return err
      });
    }

    updateEntity(id,instance){
      var that = this;
      return this.appdb.get(id).then(function (doc) {
        let updatedInstance = {...doc.data,...instance.data}
        doc.services.push(instance.servicedata)
        return that.appdb.put({
          _id: id,
          _rev: doc._rev,
          "data": updatedInstance,
          "registration" : doc.registration,
          "services": doc.services
        })
      }).then(function (response) {
      }).catch(function (err) {
        /*if (err.status == 404) {
          that.db.put({
            _id: id,
            "data": data
          });
        }*/
      });
    }
    updateFullEntity(instance){
      //debugger
      let param = {
        _id: instance._id,
        _rev: instance._rev,
        "data": instance.data,
        "registration" : instance.registration,
        "services": instance.services,
        "formVersion":instance.formVersion
      }
      if(instance.parentId){
        param.parentId = instance.parentId
      }
      return this.appdb.put(param).catch(function (err) {
      });
    }

    deleteEntity(id){
      var that = this;
      return this.appdb.get(id).then(function (doc) {
        return that.appdb.remove(doc);
      }).then(function (response) {
      }).catch(function (err) {
      });
    }

    getAllEntities(){
      return this.appdb.allDocs({include_docs: true}).then(function(docs) {  
        return docs;
      }).catch(function (err) {
      });
    }

    cleanAppDB() {
      var that = this;
      return this.appdb.destroy().then(function (response) {
        //that.setDatabase()
        return response;
      }).catch(function (err) {
      });
      
  }
}

const OfflineDb = new OfflineDbClass();
export default OfflineDb;