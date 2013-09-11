//TODO remove beer-model dependency
define(['angular', 'app', 'beer-model', 'filters', 'photo-service'], function(angular, app) {
  'use strict';

  app.controller('PhotoListCtrl', 
                   function PhotoListCtrl($scope, $routeParams, photoService) {
                     $scope.pageSize = 54;
                     $scope.sortBy = $routeParams.sortBy || 'alpha';
                     $scope.offset = $routeParams.offset ? parseInt($routeParams.offset, 10) : 0;
                     $scope.photos = photoService.getPhotos();
                     $scope.prefetchDetailPage = function(photo) {
                       (new Image()).src = photo.getMediumUrl();
                       photo.prefetchDetailPage();
                     }
                   }
                  );

    app.controller('PhotoDetailCtrl', 
                   function PhotoDetailCtrl($scope, $routeParams, photoService) {
                     $scope.photoId = $routeParams.photoId;
                     $scope.photo = photoService.getPhoto($scope.photoId);
                     $scope.photo.prefetchDetailPage();
                   }
                  );

});
