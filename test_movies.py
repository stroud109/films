import json
from movies import app
from unittest import TestCase, main


class MoviesTestCase(TestCase):

    def setUp(self):
        self.app = app.test_client()

    def get_results(self, q):
        rv = self.app.get('/search?q=' + q)
        self.assertEquals(rv.status_code, 200)
        return json.loads(rv.data)['results']

    def test_search_180(self):
        results = self.get_results('180')
        self.assertEquals(len(results), 1)
        self.assertEquals(results[0]['title'], '180')
        self.assertEquals(len(results[0]['locations']), 8)

    def test_search_empty(self):
        results = self.get_results('')
        self.assertEquals(len(results), 0)

    def test_nonexistant_film(self):
        results = self.get_results('flavatar')
        self.assertEquals(len(results), 0)

    def test_multiple_results_returned(self):
        results = self.get_results('bird')
        self.assertEquals(len(results), 2)

if __name__ == '__main__':
    main()
