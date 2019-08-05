import os
import logging
from time import time, sleep
from flask import Flask, render_template

from .config import dashboard_config_loader, load, Mode, default_dashboard_data
from .api import api
from .javascript_libraries import javascript_libraries

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
    try:
        dashboard_config_loader.load()
    except FileNotFoundError:
        # first run, there is no dashboard config
        pass
    return render_template('index.html',
                           version = version,
                           dev_mode = app.debug,
                           initial_data = dashboard_config_loader.data or default_dashboard_data,
                           javascript_libraries = javascript_libraries[Mode.DEVELOPMENT],
                           sync_server_port = config.sync_server.port,
                           )

@app.route('/test')
def test():
    print('test start')
    sleep(5)
    print('test end')
    return 'ok'

