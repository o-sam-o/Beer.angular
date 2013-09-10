define(function() {
  'use strict';

  var TITLE_REGEX = /^\s*([^-]+)\s*-\s*([^-]+)\s*$/

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

    getBrewer: function() {
      if(this.getTitle().match(TITLE_REGEX)) {
        return TITLE_REGEX.exec(this.getTitle())[1];
      } else {
        return null;
      }
    },

    getName: function() {
      if(this.getTitle().match(TITLE_REGEX)) {
        return TITLE_REGEX.exec(this.getTitle())[2];
      } else {
        return this.getTitle();
      }
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
