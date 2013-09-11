define(['services'], function(services) {
  'use strict';

  // Note: I am just playing around here, this things it totally more trouble then it's worth
  services.factory('LocalStorageDB', function($q) {

    var LsLinkList = function() {
    }
    LsLinkList.prototype = new Array;

    var LocalStorageDB = function(options) {
      this.options = options || {};
    }

    LocalStorageDB.prototype = {

      getList: function() {
        var storableMeta = this._get(this.options.key);

        if(storableMeta) {
          return this._makeArrayLike(storableMeta);
        }

        var array = this.options.loadList();
        if (array.$promise) {
          //Handle promise
          return array.$promise.then(function(result) {
            this._storeArray(this.options.key, result);
            result = this._postProcessArray(result);
            return $q.when(result);
          }.bind(this));
        } else {
          this._storeArray(this.options.key, array);
          return this._postProcessArray(array);
        }
      },

      _getEntryKey: function(key, entry) {
        return this._getKey(entry.id);
      },

      _getKey: function(key, id) {
        return '_ll_' + key + '_' + id;
      },

      _storeArray: function(key, array) {
        if(!array || array.length === 0) {
          return;
        }

        var previous;
        array.map(function(entry) {
          entry._key = this._getEntryKey(key, entry);
          if(previous) {
            previous._llNextKey = entry._key;
          }
          previous = entry;
          return entry;
        }, this).forEach(function(entry) {
          this.store(entry);
        }, this);

        localStorage.setItem(key, JSON.stringify({
          length: array.length,
          firstKey: (array[0] ? array[0]._key : null)
        }));
      },

      _postProcess: function(entry) {
        if(entry && this.options.postProcess) {
          var postProcessed = this.options.postProcess(entry);
          postProcessed._llNextKey = entry._llNextKey;
          return postProcessed;
        } else {
          return entry;
        }
      },

      _postProcessArray: function(array) {
        return array.map(function(entry) {
          return this._postProcess(entry);
        }, this);
      },

      _makeArrayLike: function(storableMeta) {
        var first = this._getItem(storableMeta.firstKey);
        var retrievedEntries = {
          0: first
        }

        var arrayLike = new LsLinkList
        arrayLike[0] = first;
        arrayLike.length = storableMeta.length;

        var lsGet = this._getItem.bind(this);
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

        //TODO remove
        window.debugArray = arrayLike;
        return arrayLike;
      },

      _getItem: function(key) {
        return this._postProcess(
          this._get(key)
        );
      },

      _get: function(key) {
        return JSON.parse(localStorage.getItem(key));
      },

      getById: function(id) {
        //TODO handle load failure
        return this._getItem(this._getKey(id));
      },

      store: function(entry) {
        localStorage.setItem(entry._key, JSON.stringify(entry));
      }
    }

    return LocalStorageDB;
  });
});
