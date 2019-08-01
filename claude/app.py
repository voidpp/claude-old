import os
import logging
from time import time
from flask import Flask, render_template, jsonify, request
from flask_sockets import Sockets
from geventwebsocket.websocket import WebSocket
import json
from time import time

from .config import load, dashboard_config_loader, config_loader
from .websocket_listener import WebsocketListener, WebsocketListenerList
from .tools import dict_merge

app = Flask(__name__)

sockets = Sockets(app)

config = load()

logger = logging.getLogger(__name__)

if not config:
    print('no config')
    exit(1)

@app.route('/')
def index():
    version = str(time())
    return render_template('index.html', version = version, dev_mode = app.debug, initial_data = dashboard_config_loader.data)

listeners = [] # type: WebsocketListenerList

action_log_filename = os.path.join(config_loader.path, 'action.log')

@sockets.route('/listen')
def listen(ws: WebSocket):
    listener = WebsocketListener(ws)
    listeners.append(listener)
    logger.info("websocket client from %s has been connected", listener.remote_addr)

    while not ws.closed:
        raw_msg = ws.receive()
        if not raw_msg:
            break

        logger.debug("Received websocket message: %s", raw_msg)

        message = json.loads(raw_msg)

        action = message['action']
        diff = message['diff']

        dict_merge(diff['added'], dashboard_config_loader.data)
        dict_merge(diff['updated'], dashboard_config_loader.data)
        for key, node in diff['deleted'].items():
            for id in node:
                del dashboard_config_loader.data[key][id]

        dashboard_config_loader.dump()

        dispatch_listeners = list(filter(lambda l: l != listener, listeners))

        action_time = str(time())
        action['time'] = action_time
        action_msg = json.dumps(action)

        with open(action_log_filename, 'a+') as f:
            f.write("%s %s\n" % (action_time, action_msg))

        logger.debug("Action dispatch to %s listener(s)", len(dispatch_listeners))
        for listn in dispatch_listeners:
            listn.send(action_msg)

    listeners.remove(listener)
    logger.info("websocket client from %s has been disconnected. Remaining listeners: %s", listener.remote_addr, len(listeners))
