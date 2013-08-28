define(['angular', 'photo-service', 'filters'], function(angular) {
  'use strict';

  return angular.module('beers', ['beerServices', 'beerFilters']);
});
