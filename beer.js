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
                                return JSON.parse(data).photoset.photo;
                              }
                            }
                          });

                          return {
                            getPhotos: function() {
                              return Photo.query({photoset_id: PHOTOSET_ID});
                            },
                            getPhoto: function(id) {
                              return Photo.get({photo_id: id});
                            }
                          };
  });


  angular.module('beerFilters', []).filter('photoSort', function() {
    return function(input, order) {
      return input.sort(function(p1, p2) {
        switch(order) {
          case 'alpha':
            return (p1.title < p2.title ? -1 : (p1.title > p2.title ? 1 : 0));
          default:
            console.log('unknown sort order ' + sort);
            return 0;
        }
      });
    }
  });

  var beers = angular.module('beers', ['beerServices', 'beerFilters']);
  beers.controller('PhotoListCtrl', 
                   function PhotoListCtrl($scope, photoService) {
                     $scope.sortOrder = 'alpha'
                     $scope.photos = photoService.getPhotos();
                   }
                  );

    beers.controller('PhotoDetailCtrl', 
                   function PhotoDetailCtrl($scope, $routeParams, photoService) {
                     $scope.photoId = $routeParams.photoId;
                     $scope.photo = photoService.getPhoto($scope.photoId);
                   }
                  );


  beers.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/photos', {templateUrl: 'partials/photo-list.html',   controller: 'PhotoListCtrl'}).
      when('/photos/:photoId', {templateUrl: 'partials/photo-detail.html', controller: 'PhotoDetailCtrl'}).
      otherwise({redirectTo: '/photos'});
  }]);

}());
