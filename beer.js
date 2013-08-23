'use strict';
(function() {
  var API_KEY = "ef9ad4ef689af505cde45ec1dc31120f";
  var PHOTOSET_ID = "72157625277593652"

  var PhotoSummary = function(attr) {
    this.attr = attr;
  }
  PhotoSummary.prototype = {
    getId: function() {
      return this.attr.id;
    },

    getTitle: function() {
      return this.attr.title;
    },

    getSmallUrl: function() {
      return this.attr.url_s;
    },

    getSmallWidth: function() {
      return this.attr.width_s;
    },

    getSmallHeight: function() {
      return this.attr.height_s;
    },

    compareByTitle: function(other) {
      return (this.getTitle() < other.getTitle() ? -1 : (this.getTitle() > other.getTitle() ? 1 : 0));
    },

    toHash: function() {
      return this.attr;
    }
  }


  var PhotoModel = function(attr) {
    this.attr = attr;
  }

  PhotoModel.prototype = {
    getTitle: function() {
      return this.attr.title._content;
    },

    getMediumUrl: function() {
      //TODO
      return '';
    }
  };

  var LsLinkList = function() {
  }
  LsLinkList.prototype = new Array;

  var LocalStorageDB = function() {

  }

  LocalStorageDB.prototype = {

    load: function(key, noEntryCallback) {
      var storableMeta = this._get(key);

      if(storableMeta) {
        return this._makeArrayLike(storableMeta);
      }

      var array = noEntryCallback();
      if (array.$then) {
        //Handle promise
        array.$then(function(response) {
          this._storeArray(key, response.data);
          return response;
        }.bind(this));
      } else {
        this._storeArray(key, array);
      }
      return array;
    },

    _getEntryKey: function(key, entry) {
      return '_ll_' + key + '_' + entry.id;
    },

    _storeArray: function(key, array) {
      var previous;
      array.map(function(entry) {
        if(previous) {
          previous._llNextKey = this._getEntryKey(key, entry);
        }
        previous = entry;
        return entry;
      }, this).forEach(function(entry) {
        localStorage.setItem(this._getEntryKey(key, entry), JSON.stringify(entry));
      }, this);

      localStorage.setItem(key, JSON.stringify({
        length: array.length,
        firstKey: (array[0] ? this._getEntryKey(key, array[0]) : null)
      }));
    },

    _makeArrayLike: function(storableMeta) {
      var first = this._get(storableMeta.firstKey);
      var retrievedEntries = {
        0: first
      }

      var arrayLike = new LsLinkList
      arrayLike[0] = first;
      arrayLike.length = storableMeta.length;

      var lsGet = this._get;
      for(var i = 1; i < storableMeta.length; i++) {
        (function(index) {
          Object.defineProperty(arrayLike, index, {
            get: function() {
              if(!first || index < 0) {
                return null;
              }
              if(!retrievedEntries[index]) {
                var previous = arrayLike[index - 1];
                retrievedEntries[index] = lsGet(previous._llNextKey);
              }

              return retrievedEntries[index];
            }
        });
        })(i);
      }

      return arrayLike;
    },

    _get: function(key) {
      return JSON.parse(localStorage.getItem(key));
    }
  }

  var lsDb = new LocalStorageDB();

  var services = angular.module('beerServices', ['ngResource']);
  services.factory('photoService', function($resource) {
    var Photo = $resource('http://api.flickr.com/services/rest/', 
                          {
                            api_key: API_KEY,
                            format: 'json',
                            nojsoncallback: 1
                          },
                          {
                            get: {
                              method: 'get',
                              params: {
                                method: 'flickr.photos.getInfo'
                              },
                              transformResponse: function(data) {
                                return JSON.parse(data).photo;
                              }
                            },
                            query: {
                              method: 'get',
                              params: {
                                method: 'flickr.photosets.getPhotos',
                                extras: ['date_taken', 'url_t', 'url_m', 'url_s', 'tags'].join(',')
                              },
                              isArray: true,
                              transformResponse: function(data) {
                                return JSON.parse(data).photoset.photo;                              }
                            }
                          });

                          return {
                            getPhotos: function() {
                              return lsDb.load('photoStream', function() {
                                return Photo.query({photoset_id: PHOTOSET_ID});
                              })
                            },
                            getPhoto: function(id) {
                              return new PhotoModel(Photo.get({photo_id: id}));
                            }
                          };
  });


  angular.module('beerFilters', []).filter('photoSort', function() {
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

  var beers = angular.module('beers', ['beerServices', 'beerFilters']);
  beers.controller('PhotoListCtrl', 
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

    beers.controller('PhotoDetailCtrl', 
                   function PhotoDetailCtrl($scope, $routeParams, photoService) {
                     $scope.photoId = $routeParams.photoId;
                     $scope.photo = photoService.getPhoto($scope.photoId);
                   }
                  );


  beers.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/photos', {templateUrl: 'partials/photo-list.html',   controller: 'PhotoListCtrl'}).
      when('/photos/:photoId', {templateUrl: 'partials/photo-detail.html', controller: 'PhotoDetailCtrl'}).
      otherwise({redirectTo: '/photos'});
  }]);

}());
