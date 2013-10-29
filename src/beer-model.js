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

    getDescription: function() {
      //Flickr seems to sometimes add a whitespace description
      return $.trim(this._detailedAttr('description'));
    },

    getDateTaken: function() {
      if(!this.dateTaken) {
        var parts = this.attr.datetaken.split(' ');
        var datePart = parts[0].split('-');
        var timePart = parts[1].split(':');
        this.dateTaken = new Date(datePart[0], datePart[1] - 1, datePart[2], timePart[0], timePart[1], timePart[2]);
      }
      return this.dateTaken;
    },

    _detailedAttr: function(name) {
      if(this.attr.detailed) {
        var v = this.attr.detailed[name];
        if(v) {
          return '_content' in v ? v._content : v;
        }
      }

      return null;
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

    compareByDateTaken: function(other) {
      return (this.getDateTaken() < other.getDateTaken() ? -1 : (this.getDateTaken() > other.getDateTaken() ? 1 : 0));
    },

    toHash: function() {
      return this.attr;
    }
  }

  return PhotoSummary;
});
