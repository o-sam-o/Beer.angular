define(function() {
  'use strict';

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

    getMediumUrl: function() {
      return this.attr.url_m;
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

  return PhotoSummary;
});
