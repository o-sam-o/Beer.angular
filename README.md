# Beer.angular

Overview
--------
[Angular](http://angularjs.org/) backed rendering of my [Flickr beer collection](http://www.flickr.com/photos/cavenagh/sets/72157625277593652/with/9631336651/).  

This project originally started as an Angular port of [Beer.backbone](https://www.github.com/o-sam-o/Beer.backbone) 
but I changed the focus a little to ensure optimal performance on mobile 
devices and experiment with technologies such as local storage and web workers.

The Premise
-----------
Create a photographic collection of beer bottles (ideally that I have drunk).
While I try to ensure the label is readable, image quality is not a priority.
Most photos are taken with my phone and often in poor lighting conditions.
The same beer is allowed to feature multiple times in the collection if there is some kind
of variation in the bottle.

The Tech
--------
* [AngularJS](http://angularjs.org/)
* [Bootscrap](http://getbootstrap.com/)
* [RequireJS](http://requirejs.org/)
* Local Storage
    - Used to cache the photo details sourced from Flickr
* Web worker
    - Used for search

Attribution
-----------
* beer icon : [Visual Pharm](http://www.visualpharm.com)

TODO
----
* Add endless scroll
* Add auto refresh
* Add map where photo was taken
* Add offline support
* Support reverse sort order
* Refactor code ...
* Todo support ordering in search

Licence
-------
MIT
