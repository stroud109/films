$(function () {
  'use strict';

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

  var mapOptions = {
    center: new google.maps.LatLng(37.7833, -122.4167),
    zoom: 11
  };
  var map = new google.maps.Map(document.getElementById("map-canvas"),
      mapOptions);

  var Locations = Backbone.Collection.extend({

    parse: function (response) {
      if (response.results) {
        return response.results[0].locations;
      }
    }

  });

  var locations = new Locations();

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

        if (!address.match(/sf/i)) {
          address += ', SF';
        }

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

            self.markers.push(marker);
        });
      });
    }
  });

  var mapView = new MapView();

  var Router = Backbone.Router.extend({

    routes: {
      ':title': 'addPins'
    },

    addPins: function (title) {
      locations.url = '/search?q=' + title;
      locations.fetch();
      searchInput.val(title);
    }

  });

  var app = new Router();
  searchInput.on('typeahead:selected', function(e, selected){
      app.navigate(selected.title, {trigger: true});
  });
  Backbone.history.start();
});
