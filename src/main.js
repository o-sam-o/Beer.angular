require.config({
    baseUrl: 'src',
    paths: {
        angular: '../lib/angular.min',
        'angular-resource': '../lib/angular-resource.min',
        'angular-route': '../lib/angular-route.min',
        jquery: '../lib/jquery-2.0.3.min',
        bootstrap: '../lib/bootstrap.min'
    },
    shim: {
      angular : {'exports' : 'angular'},
      bootstrap: {
        dep: ['jquery'],
        exports: "$.fn.popover"
      },
      'angular-resource': {
        dep: ['angular']
      },
      'angular-route': {
        dep: ['angular']
      }
    }
});

window.name = "NG_DEFER_BOOTSTRAP!";

require(['angular', 'app', 'jquery', 'routes', 'bootstrap'], function(angular, app, $) {
  // Source : https://github.com/tnajdek/angular-requirejs-seed/blob/master/app/js/main.js
  var $html = angular.element(document.getElementsByTagName('html')[0]);

	angular.element().ready(function() {
		$html.addClass('ng-app');
		angular.bootstrap($html, [app['name']]);
	});

  $('#about-modal').modal({
    keyboard: true,
    backdrop: true,
    show: false
  });

});
