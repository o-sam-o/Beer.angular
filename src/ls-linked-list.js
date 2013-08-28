define(function() {
  'use strict';

  var LsLinkList = function() {
  }
  LsLinkList.prototype = new Array;

  var LocalStorageDB = function() {

  }

  LocalStorageDB.prototype = {

    load: function(key, noEntryCallback) {
      var storableMeta = this._get(key);

      if(storableMeta) {
        return this._makeArrayLike(storableMeta);
      }

      var array = noEntryCallback();
      if (array.$then) {
        //Handle promise
        array.$then(function(response) {
          this._storeArray(key, response.data);
          return response;
        }.bind(this));
      } else {
        this._storeArray(key, array);
      }
      return array;
    },

    _getEntryKey: function(key, entry) {
      return '_ll_' + key + '_' + entry.id;
    },

    _storeArray: function(key, array) {
      var previous;
      array.map(function(entry) {
        if(previous) {
          previous._llNextKey = this._getEntryKey(key, entry);
        }
        previous = entry;
        return entry;
      }, this).forEach(function(entry) {
        localStorage.setItem(this._getEntryKey(key, entry), JSON.stringify(entry));
      }, this);

      localStorage.setItem(key, JSON.stringify({
        length: array.length,
        firstKey: (array[0] ? this._getEntryKey(key, array[0]) : null)
      }));
    },

    _makeArrayLike: function(storableMeta) {
      var first = this._get(storableMeta.firstKey);
      var retrievedEntries = {
        0: first
      }

      var arrayLike = new LsLinkList
      arrayLike[0] = first;
      arrayLike.length = storableMeta.length;

      var lsGet = this._get;
      for(var i = 1; i < storableMeta.length; i++) {
        (function(index) {
          Object.defineProperty(arrayLike, index, {
            get: function() {
              if(!first || index < 0) {
                return null;
              }
              if(!retrievedEntries[index]) {
                var previous = arrayLike[index - 1];
                retrievedEntries[index] = lsGet(previous._llNextKey);
              }

              return retrievedEntries[index];
            }
        });
        })(i);
      }

      return arrayLike;
    },

    _get: function(key) {
      return JSON.parse(localStorage.getItem(key));
    }
  }

  var lsDb = new LocalStorageDB();

  return lsDb;
});
