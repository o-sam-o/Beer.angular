define(['angular'], function(angular) {
  'use strict';

  var filterModule = angular.module('beerFilters', []);
  
  filterModule.filter('photoSort', function() {
    return function(input, order) {
      return input.sort(function(p1, p2) {
        switch(order) {
          case 'alpha':
            return p1.compareByTitle(p2);
          default:
            console.log('unknown sort order ' + sort);
            return 0;
        }
      });
    }
  });

});

