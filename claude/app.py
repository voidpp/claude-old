from time import time
from flask import Flask, render_template
from flask_graphql import GraphQLView

from .config import load
from .db import Database

from .api import create_schema

app = Flask(__name__)

config = load()

if not config:
    print("config not found!")
    exit(1)

db = Database(config.database)

schema = create_schema(db)

@app.route('/')
def index():
    version = str(time())
    return render_template('index.html', version = version, dev_mode = app.debug)

app.add_url_rule("/graphql", view_func = GraphQLView.as_view("graphql", schema = schema, graphiql = True))
