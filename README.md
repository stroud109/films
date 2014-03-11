#Film Locations in San Francisco

###Overview

Film Locations is a single page web app where users can search for movies shot in San Francisco and see specific filming locations.

This web app uses Flask, Backbone and Google Maps JavaScript API v3.

###API

I have a JSON API with a single endpoint, "/search", that returns a set of movie results based on a query parameter. The results are formatted as an array of objects for easier integration with Backbone.

###Autocomplete

I'm using Bootstrap's [Typeahead](https://github.com/twitter/typeahead.js/) for the autocomplete and dropdown functionality. Styles for the Typeahead plugin come from [here](https://github.com/hyspace/typeahead.js-bootstrap3.less/).

###Geocoding

The [Film data](https://data.sfgov.org/Arts-Culture-and-Recreation-/Film-Locations-in-San-Francisco/yitu-d5am) doesn't include latitude or longitude, so I need to use an API that included geocoding, or the translation of addresses or landmarks to lat/long positions. I use Google Maps JavaScript API v3 for dynamic geocoding, and I've modified functionality from [here](http://stackoverflow.com/questions/19640055/multiple-markers-google-map-api-v3-from-array-of-addresses-and-avoid-over-query) to display multiple map markers simultaneously.
