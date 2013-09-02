define(['angular', 'photo-service', 'filters', 'angular-route'], function(angular) {
  'use strict';

  return angular.module('beers', ['beerServices', 'beerFilters', 'ngRoute']);
});
