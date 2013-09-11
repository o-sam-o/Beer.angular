define(['services', 'beer-model', 'ls-linked-list'], function(services, PhotoSummary) {
  'use strict';

  var API_KEY = "ef9ad4ef689af505cde45ec1dc31120f";
  var PHOTOSET_ID = "72157625277593652";

  services.factory('photoService', function($resource, LocalStorageDB) {
    var lsDB = new LocalStorageDB({
      key: 'photoStream',
      loadList: function() {
        return Photo.query({photoset_id: PHOTOSET_ID});
      }, 
      postProcess: function(entry) {
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
      }
    });

    var photos = null;
    var Photo = $resource('http://api.flickr.com/services/rest/', 
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
                                return lsDB.getById(id);
                              }
                            };
                          });
  });
