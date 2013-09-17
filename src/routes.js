define(['angular', 'app', 'controllers'], function(angular, app) {
  'use strict';

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/photos/:sortBy/:offset', {templateUrl: 'partials/photo-list.html'}).
      when('/photos', {templateUrl: 'partials/photo-list.html'}).
      when('/photos/:photoId', {templateUrl: 'partials/photo-detail.html'}).
      when('/', {templateUrl: 'partials/photo-list.html'}).
      otherwise({redirectTo: '/'});
  }]);

});

