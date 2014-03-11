import json

from flask import (
    Flask,
    jsonify,
    render_template,
    request,
)

app = Flask(__name__)

with open('movies.json') as jsonfile:
    MOVIE_DATA = json.loads(jsonfile.read())

    MOVIES = {}

    for movie in MOVIE_DATA['data']:
        title_lower = movie[8].lower()
        location = movie[10]
        if title_lower not in MOVIES:
            MOVIES[title_lower] = {
                'title': movie[8],
                'locations': [{'address': location}]
            }
        else:
            MOVIES[title_lower]['locations'].append({'address': location})


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/backbone_starter')
def backbone_starter():
    return render_template('backbone_starter.html')


@app.route('/search')
def search():

    search_term = request.args.get('q')
    search_term = search_term.lower()

    results = []

    if search_term:

        for title, info in MOVIES.items():
            if search_term in title:
                results.append(info)

    return jsonify({'results': results})

if __name__ == '__main__':
    app.run(
        debug=True,
        host='0.0.0.0',
        port=5000,
    )
