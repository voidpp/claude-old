import os
import logging
from time import time, sleep
from flask import Flask, render_template, jsonify, request

from .config import dashboard_config_loader, load
from .api import api

app = Flask(__name__)
app.register_blueprint(api)

config = load()

logger = logging.getLogger(__name__)

if not config:
    print('no config')
    exit(1)

@app.route('/')
def index():
    version = str(time())
    # need to reload every time when the dashboard app started because the sync service writes the dashboard file
    dashboard_config_loader.load()
    return render_template('index.html', version = version, dev_mode = app.debug, initial_data = dashboard_config_loader.data)

@app.route('/test')
def test():
    print('test start')
    sleep(5)
    print('test end')
    return 'ok'
