//TODO remove beer-model dependency
define(['angular', 'app', 'beer-model', 'filters', 'photo-service'], function(angular, app) {
  'use strict';

  var DEFAULT_SORT_BY = 'dateTaken';

  app.controller('PhotoListCtrl', 
                   function PhotoListCtrl($scope, $routeParams, photoService, $location) {
                     $scope.pageSize = 54;
                     $scope.sortBy = $routeParams.sortBy || DEFAULT_SORT_BY;
                     console.log('PhotListCtrl - ' + $scope.sortBy);
                     $scope.offset = $routeParams.offset ? parseInt($routeParams.offset, 10) : 0;
                     $scope.loading = false;
                     $scope.searchTerm = $location.search().q;

                     if($scope.searchTerm) {
                       console.log('Search for ' + $scope.searchTerm);
                       $scope.loading = true;
                       $scope.photos = [];
                       photoService.search({term: $scope.searchTerm}).then(
                         function(value) {
                         $scope.loading = false;
                         console.log('success complete');
                       }, function() {
                         alert('search error');
                       }, function(value) {
                         $scope.photos.push(value);
                       });
                     } else {
                       $scope.photos = photoService.getPhotos($scope.sortBy);
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
                   function PhotoDetailCtrl($scope, $routeParams, photoService, $location) {
                     $scope.photoId = $routeParams.photoId;
                     $scope.photo = photoService.getPhoto($scope.photoId);
                     $scope.loading = false;
                     if(!$scope.photo) {
                       //FIXME can see template when this happens
                       alert('Photo not found');
                       $location.path('/');
                       return;
                     } else if($scope.photo.then) {
                       $scope.loading = true;
                       $scope.photo.then(function(photo) {
                         $scope.photo = photo;
                         $scope.photo.prepDetailPage();
                         $scope.loading = false;
                       });
                     } else {
                      $scope.photo.prepDetailPage();
                     }
                   }
                  );

  app.controller('NavCtrl',
                 function PhotoDetailCtrl($routeParams, $scope, $location) {
                   $scope.sortBy = $routeParams.sortBy || DEFAULT_SORT_BY;
                   $scope.refresh = function() {
                     console.log('refresh');
                     localStorage.clear();
                     location.reload();
                   };
                   $scope.doSort = function() {
                     console.log('Do sort: ' + $scope.sortBy);
                     $location.path('/photos/' + $scope.sortBy + '/0');
                   };
                 }
                );

    app.controller('SearchFormCtrl', 
                   function SearchFormCtrl($scope, $location) {
                     $scope.searchTerm = $location.search().q || '';
                     $scope.doSearch = function() {
                       $location.path('/').search({q: $scope.searchTerm});
                     };
                   }
                  );

});
