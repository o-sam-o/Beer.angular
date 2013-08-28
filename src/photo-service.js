define(['angular', 'beer-model', 'ls-linked-list', 'angular-resource'], function(angular, PhotoSummary, lsDb) {
  'use strict';

  var API_KEY = "ef9ad4ef689af505cde45ec1dc31120f";
  var PHOTOSET_ID = "72157625277593652";

  //TODO delete PhotoModel ... it should be merged with PhotoSummary
  var PhotoModel = function(attr) {
    this.attr = attr;
  }
  PhotoModel.prototype = {
    getTitle: function() {
      return this.attr.title._content;
    },

    getMediumUrl: function() {
      //TODO
      return '';
    }
  };


  var services = angular.module('beerServices', ['ngResource']);
  services.factory('photoService', function($resource) {
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
                              return lsDb.load('photoStream', function() {
                                return Photo.query({photoset_id: PHOTOSET_ID});
                              })
                            },
                            getPhoto: function(id) {
                              return new PhotoModel(Photo.get({photo_id: id}));
                            }
                          };
  });
});
