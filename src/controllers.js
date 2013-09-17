//TODO remove beer-model dependency
define(['angular', 'app', 'beer-model', 'filters', 'photo-service'], function(angular, app) {
  'use strict';

  app.controller('PhotoListCtrl', 
                   function PhotoListCtrl($scope, $routeParams, photoService, $location) {
                     $scope.pageSize = 54;
                     $scope.sortBy = $routeParams.sortBy || 'alpha';
                     $scope.offset = $routeParams.offset ? parseInt($routeParams.offset, 10) : 0;

                     if($location.search().q) {
                       console.log('Search for ' + $location.search().q);
                       $scope.photos = [];
                       photoService.search({term: $location.search().q}).then(
                         function(value) {
                         console.log('success complete');
                       }, function() {
                         console.log('search error');
                       }, function(value) {
                         $scope.photos.push(value);
                       });
                     } else {
                       $scope.photos = photoService.getPhotos();
                     }

                     $scope.prefetchDetailPage = function(photo) {
                       (new Image()).src = photo.getMediumUrl();
                       photo.prepDetailPage();
                     }
                   }
                  );

    app.controller('PhotoDetailCtrl', 
                   function PhotoDetailCtrl($scope, $routeParams, photoService) {
                     $scope.photoId = $routeParams.photoId;
                     $scope.photo = photoService.getPhoto($scope.photoId);
                     $scope.photo.prepDetailPage();
                   }
                  );

    app.controller('SearchFormCtrl', 
                   function SearchFormCtrl($scope, $location) {
                     $scope.searchTerm = $location.search().q || '';
                     $scope.doSearch = function() {
                       $location.search('q', $scope.searchTerm);
                     };
                   }
                  );

});
