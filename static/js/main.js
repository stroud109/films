(function () {
  'use strict';

  $('.search-input').typeahead({}, {
        displayKey: 'title',
        source: function (query, callback) {
          $.get('/search?q=' + query, function (response) {
            return callback(response.results);
          });
        }
  });

})();
