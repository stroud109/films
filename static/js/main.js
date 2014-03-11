$(function () {
  'use strict';

  /**
   * Typeahead.js
   *
   * I'm using Bootstrap's Typeahead for the autocomplete and dropdown
   * functionality.
   *
   * https://github.com/twitter/typeahead.js/
   */
  var searchInput = $('.search-input');

  searchInput.typeahead({
    autoselect: true
  }, {
    displayKey: 'title',
    source: function (query, callback) {
      $.get('/search?q=' + query, function (response) {
        return callback(response.results);
      });
    }
  });

  /**
   * Google Maps API
   *
   * I'm using Google maps for the map interface, geocoding, markers and
   * info boxes.
   */
  var mapOptions = {
    center: new google.maps.LatLng(37.7833, -122.4167),
    zoom: 11
  };

  var map = new google.maps.Map($('#map-canvas')[0], mapOptions);

  /**
   * A Backbone collection for fetching and storing the current
   * markers on the map.
   */
  var Locations = Backbone.Collection.extend({
    parse: function (response) {
      if (response.results) {
        return response.results[0].locations;
      }
    }
  });

  var locations = new Locations();

  /**
   * A wrapper for the Google map instance.
   *
   * On `locations` reset event, clears the map and adds all
   * new markers to the map.
   */
  var MapView = Backbone.View.extend({
    initialize: function () {
      locations.on('reset', this.render, this);
      this.markers = [];
    },

    render: function () {
      var self = this;
      while (this.markers.length) {
        this.markers.pop().setMap(null);
      }
      locations.each(function (model){
        var address = model.get('address');

        var contentString = '<div>' +
        '<p>' + address + '</p>' +
        '</div>';

        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });

        // Locations such as 'City Hall' will only show up on the map
        // if 'SF' is added to the end. For example, 'City Hall, SF'.
        if (!address.match(/sf/i)) {
          address += ', SF';
        }

        // Geocoding code modified from: http://stackoverflow.com/questions/19640055/multiple-markers-google-map-api-v3-from-array-of-addresses-and-avoid-over-query
        $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(address) + '&sensor=false', null, function (data) {
            var p = data.results[0].geometry.location;
            var latlng = new google.maps.LatLng(p.lat, p.lng);
            var marker = new google.maps.Marker({
                position: latlng,
                map: map,
                title: address
            });

            google.maps.event.addListener(marker, 'click', function() {
              infowindow.open(map, marker);
            });

            // Keep track of all current markers so they can be cleared later.
            self.markers.push(marker);
        });
      });
    }
  });

  var mapView = new MapView();

  /**
   * Main router
   */
  var Router = Backbone.Router.extend({
    routes: {
      ':title': 'addMarkers',
      '': 'clearMarkers'
    },

    /**
     * Updates the `locations` URL using the title from the route, refetches
     * `locations` from the API, and sets the search input value to the title.
     */
    addMarkers: function (title) {
      locations.url = '/search?q=' + title;
      locations.fetch();
      searchInput.val(title);
    },

    /**
     * Clears markers from the map and sets the search input to empty.
     */
    clearMarkers: function () {
      locations.reset();
      searchInput.val('');
    }
  });

  var app = new Router();

  // Here's where I'm connecting the Backbone app with the Typeahead plugin.
  // When a user selects a title from the Typeahead menu, this triggers the
  // routers `addPins` method.
  searchInput.on('typeahead:selected', function(e, selected){
      app.navigate(selected.title, {trigger: true});
  });

  // Starts the app.
  Backbone.history.start();
});
