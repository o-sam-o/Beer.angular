define(['services', 'beer-model', 'ls-linked-list'], function(services, PhotoSummary) {
  'use strict';

  var API_KEY = "ef9ad4ef689af505cde45ec1dc31120f";
  var PHOTOSET_ID = "72157625277593652";
  var LS_KEY = 'photoStream';

  var Photo, lsDB;
  var wrapPhotoEntry =  function(entry) {
    var model = new PhotoSummary(entry);
    model.prepDetailPage = function() {
      if(!entry.detailed) {
        entry.detailed = Photo.get({photo_id: entry.id});
        if(entry.detailed.$promise) {
          entry.detailed.$promise.then(function() {
            lsDB.store(entry);
          });
        }
      }
    }
    return model;
  };

  services.factory('photoService', function($resource, LocalStorageDB, $q) {
    lsDB = new LocalStorageDB({
      key: LS_KEY,
      loadList: function() {
        //TODO pass values to search worker
        return Photo.query({photoset_id: PHOTOSET_ID});
      },
      postProcess: wrapPhotoEntry
    });

    var searchWorker = new Worker('src/search-worker.js');
    //Book strap worker index
    (function() {
      var get = function(key) {
        return JSON.parse(localStorage.getItem(key));
      };
      var sendDataToWorker = function(key) {
        var value = get(key);
        searchWorker.postMessage({
          type: 'index',
          value: value
        });
        return value._llNextKey;
      };

      var loadInTimeout = function(nextKey) { 
          setTimeout(function() {
            nextKey = sendDataToWorker(nextKey);
            if(nextKey) {
              loadInTimeout(nextKey);
            } else {
              searchWorker.postMessage({
                type: 'indexDone'
              });
            }
          }, 5);
      };

      var lsMeta = get(LS_KEY);
      if(lsMeta) {
        var nextKey = lsMeta.firstKey;
        loadInTimeout(nextKey);
      }
    })();
    var searchResult;
    searchWorker.addEventListener('message', function(e) {
      if(e.data === 'searchFinished') {
        searchResult.resolve();
      } else {
        var photo = wrapPhotoEntry(e.data);
        searchResult.notify(photo);
      }
    }, false);

    var photos = null;
    Photo = $resource('http://api.flickr.com/services/rest/', 
                          {
                            api_key: API_KEY,
                            format: 'json',
                            nojsoncallback: 1
                          },
                          {
                            get: {
                              method: 'get',
                              params: {
                                method: 'flickr.photos.getInfo'
                              },
                              transformResponse: function(data) {
                                return JSON.parse(data).photo;
                              }
                            },
                            query: {
                              method: 'get',
                              params: {
                                method: 'flickr.photosets.getPhotos',
                                extras: ['date_taken', 'url_t', 'url_m', 'url_s', 'tags'].join(',')
                              },
                              isArray: true,
                              transformResponse: function(data) {
                                return JSON.parse(data).photoset.photo;                              }
                            }
                          });

                          return {
                            getPhotos: function() {
                              photos = photos || lsDB.getList();
                              return photos;
                              },
                              getPhoto: function(id) {
                                //TODO handle not in lsDB
                                return lsDB.getById(id);
                              },
                              search: function(query) {
                                searchResult = $q.defer();
                                searchWorker.postMessage({
                                  type: 'search',
                                  query: query
                                });
                                return searchResult.promise;
                              }
                            };
                          });
  });
