define(['services'], function(services) {
  'use strict';

  // Note: I am just playing around here, this things it totally more trouble then it's worth
  services.factory('linkedList', function($q) {

    var LsLinkList = function() {
    }
    LsLinkList.prototype = new Array;

    var LocalStorageDB = function() {

    }

    LocalStorageDB.prototype = {

      load: function(key, noEntryCallback, options) {
        this.options = options || {};
        var storableMeta = this._get(key);

        if(storableMeta) {
          return this._makeArrayLike(storableMeta, options);
        }

        var array = noEntryCallback();
        if (array.$promise) {
          //Handle promise
          return array.$promise.then(function(result) {
            this._storeArray(key, result);
            result = this._postProcessArray(result);
            return $q.when(result);
          }.bind(this));
        } else {
          this._storeArray(key, array);
          return this._postProcessArray(array);
        }
      },

      _getEntryKey: function(key, entry) {
        return '_ll_' + key + '_' + entry.id;
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
          localStorage.setItem(entry._key, JSON.stringify(entry));
        }, this);

        localStorage.setItem(key, JSON.stringify({
          length: array.length,
          firstKey: (array[0] ? array[0]._key : null)
        }));
      },

      _postProcess: function(entry) {
        if(this.options.postProcess) {
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

      _makeArrayLike: function(storableMeta, options) {
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
      }
    }

    return new LocalStorageDB();
  });
});
