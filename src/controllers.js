//TODO remove beer-model dependency
define(['angular', 'app', 'beer-model', 'filters'], function(angular, app, PhotoSummary) {
  'use strict';

  app.controller('PhotoListCtrl', 
                   function PhotoListCtrl($scope, photoService) {
                     $scope.sortOrder = 'alpha'
                     $scope.photos = photoService.getPhotos();

                     //TODO refactor this as it's super ugly
                     if($scope.photos.$then) {
                       $scope.photos.$then(function(response) {
                         $scope.photos = response.data.map(function(photo) {
                           return new PhotoSummary(photo);
                         });
                       });
                     } else {
                       $scope.photos = $scope.photos.map(function(photo) {
                         return new PhotoSummary(photo);
                       });
                     }
                   }
                  );

    app.controller('PhotoDetailCtrl', 
                   function PhotoDetailCtrl($scope, $routeParams, photoService) {
                     $scope.photoId = $routeParams.photoId;
                     $scope.photo = photoService.getPhoto($scope.photoId);
                   }
                  );

});
