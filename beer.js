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
                              //isArray: true
                            }
                          });

    return {
      //TOO remove the need for passing in $scope
      getPhotos: function($scope) {
        return Photo.query({photoset_id: PHOTOSET_ID}, function(data) {
          console.log(data);
          $scope.photos = data.photoset.photo;
          //if(data.photoset) {
          //  $scope.photos = data.photoset.photo;
         // }
        });
      }
    };
  });

  var beers = angular.module('beers', ['beerServices']);

  beers.controller('PhotoListCtrl', 
    function PhotoListCtrl($scope, photoService) {
      $scope.photos = photoService.getPhotos($scope);
      //$scope.photos = [
        //{"title":"Lao Brewery Co - Beerlao","src":"http://farm4.staticflickr.com/3689/9225697519_008d6e5a83_m.jpg"},
        //{"title":"Brouwerij Timmermans John Martin N.V. - Bourgogne Des Flandres","src":"http://farm3.staticflickr.com/2870/9225698103_6c7a7fed3c_m.jpg"},
        //{"title":"Stieglbrauerei zu Salzburg - Stiegl Weisse","src":"http://farm3.staticflickr.com/2874/9228479838_4abf43e4b8_m.jpg"},
        //{"title":"Weihenstephaner - Hefeweissbier Dark","src":"http://farm4.staticflickr.com/3741/9225699267_6c329efbcc_m.jpg"}
      //];
    }
  );
}());
