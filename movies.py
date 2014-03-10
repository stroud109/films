import json
# import re

from flask import (
    Flask,
    jsonify,
    render_template,
    request,
)

app = Flask(__name__)

# write lev-distance-eqsue function here, and use it below

with open('movies.json') as jsonfile:
    MOVIE_DATA = json.loads(jsonfile.read())


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/backbone_starter')
def backbone_starter():
    return render_template('backbone_starter.html')


@app.route('/search')
def search():
    '''
    lev-distance-eqsue function will live here, and in `suggestions`.
    This will use ajax
    '''

    # Search the file I loaded above, find things to return
    # add them to the dictionary and then return them.
    # return JSON string

    searched_for = request.args.get('q')
    searched_for = searched_for.lower()

    results = []

    for movie in MOVIE_DATA['data']:
        if searched_for in movie[8].lower():
            results.append({'title': movie[8], 'location': movie[10]})
    return jsonify({'results': results})

        # return results with lev-distance-esque function here
        # movie title: data > (unnamed nested list) > item #9
        # locations: data > (unnamed nested list) > item #11


if __name__ == '__main__':
    app.run(
        debug=True,
        host='0.0.0.0',
        port=5000,
    )
