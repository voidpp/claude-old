from time import time
from flask import Flask, render_template, jsonify

from .config import load

app = Flask(__name__)

config = load()

if not config:
    print("config not found!")
    exit(1)

@app.route('/')
def index():
    version = str(time())
    return render_template('index.html', version = version, dev_mode = app.debug)

