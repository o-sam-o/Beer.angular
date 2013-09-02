//TODO remove beer-model dependency
define(['angular', 'app', 'beer-model', 'filters'], function(angular, app, PhotoSummary) {
  'use strict';

  app.controller('PhotoListCtrl', 
                   function PhotoListCtrl($scope, photoService) {
                     $scope.sortOrder = 'alpha'
                     $scope.photos = photoService.getPhotos();
                   }
                  );

    app.controller('PhotoDetailCtrl', 
                   function PhotoDetailCtrl($scope, $routeParams, photoService) {
                     $scope.photoId = $routeParams.photoId;
                     $scope.photo = photoService.getPhoto($scope.photoId);
                   }
                  );

});
