define(['angular', 'app', 'controllers'], function(angular, app) {
  'use strict';

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/photos', {templateUrl: 'partials/photo-list.html',   controller: 'PhotoListCtrl'}).
      when('/photos/:photoId', {templateUrl: 'partials/photo-detail.html', controller: 'PhotoDetailCtrl'}).
      otherwise({redirectTo: '/photos'});
  }]);

});

