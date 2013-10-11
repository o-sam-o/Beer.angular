//TODO remove beer-model dependency
define(['angular', 'app', 'beer-model', 'filters', 'photo-service'], function(angular, app) {
  'use strict';

  app.controller('PhotoListCtrl', 
                   function PhotoListCtrl($scope, $routeParams, photoService, $location) {
                     $scope.pageSize = 54;
                     $scope.sortBy = $routeParams.sortBy || 'alpha';
                     $scope.offset = $routeParams.offset ? parseInt($routeParams.offset, 10) : 0;
                     $scope.loading = false;

                     if($location.search().q) {
                       console.log('Search for ' + $location.search().q);
                       $scope.loading = true;
                       $scope.photos = [];
                       photoService.search({term: $location.search().q}).then(
                         function(value) {
                         $scope.loading = false;
                         console.log('success complete');
                       }, function() {
                         alert('search error');
                       }, function(value) {
                         $scope.photos.push(value);
                       });
                     } else {
                       $scope.photos = photoService.getPhotos();
                       if($scope.photos.then) {
                           console.log("Loading images from Flickr");
                           $scope.loading = true;
                           $scope.photos.then(function() {
                               $scope.loading = false;
                               console.log('loading complete');
                           }, function() {
                               alert('Load error');
                           });
                       }
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

    app.controller('NavCtrl',
                   function PhotoDetailCtrl($scope) {
                       $scope.refresh = function() {
                           console.log('refresh');
                           localStorage.clear();
                           location.reload();
                       };
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
