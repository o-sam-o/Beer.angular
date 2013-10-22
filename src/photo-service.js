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
        return Photo.query({photoset_id: PHOTOSET_ID});
      },
      postProcess: wrapPhotoEntry,
      sorters: {
        dateTaken: function(p1, p2) {
          //FIXME instanciating model instances here is hacky
          p1 = new PhotoSummary(p1);
          p2 = new PhotoSummary(p2);
          return p2.compareByDateTaken(p1);
        },
        alphabetic: function(p1, p2) {
          p1 = new PhotoSummary(p1);
          p2 = new PhotoSummary(p2);
          return p1.compareByTitle(p2);
        }
      }
    });

    //FIXME this stuff should somehow live in the linked list
    var doSearchIndex;
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
        return value._llNextKey['default'];
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
          }, 3);
      };

     doSearchIndex = function() {
        var lsMeta = get(LS_KEY);
        if(lsMeta) {
          var nextKey = lsMeta.firstKeys['default'];
          loadInTimeout(nextKey);
        }
     }
     doSearchIndex();
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

    var photosSortedBy = {};
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
                            getPhotos: function(sortBy) {
                                var photos = photosSortedBy[sortBy] || lsDB.getList(sortBy);
                                photosSortedBy[sortBy] = photos;
                                if(photos.then) {
                                    photos.then(function() {
                                        doSearchIndex();
                                    });
                                }
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
