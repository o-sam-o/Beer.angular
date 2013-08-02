'use strict';
(function() {
  var API_KEY = "ef9ad4ef689af505cde45ec1dc31120f";
  var PHOTOSET_ID = "72157625277593652"

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
                                return JSON.parse(data).photoset.photo;
                              }
                            }
                          });

                          return {
                            getPhotos: function() {
                              return Photo.query({photoset_id: PHOTOSET_ID});
                            }
                          };
  });

  var beers = angular.module('beers', ['beerServices']);

  beers.controller('PhotoListCtrl', 
                   function PhotoListCtrl($scope, photoService) {
                     $scope.photos = photoService.getPhotos();
                   }
                  );
}());
