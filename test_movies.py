import json
from movies import app
from unittest import TestCase, main


class MoviesTestCase(TestCase):

    def setUp(self):
        self.app = app.test_client()

    def test_search_180(self):
        rv = self.app.get('/search?q=180')
        self.assertEquals(rv.status_code, 200)
        self.assertEquals(len(json.loads(rv.data)['results']), 8)

if __name__ == '__main__':
    main()
