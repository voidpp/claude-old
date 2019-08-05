import logging
import signal
import asyncio
import websockets
import json
from time import time
from configpp.soil import GroupMember

from claude.tools import dict_merge
from claude.config import default_dashboard_data
from .listener import WebsocketListener

logger = logging.getLogger(__name__)

class Server:

    def __init__(self, port: int, dashboard_config_loader: GroupMember, host = '0.0.0.0'):

        self._port = port
        self._host = host
        self._listeners = []
        self._dashboard_config_loader = dashboard_config_loader

    @asyncio.coroutine
    def new_listener(self, websocket: websockets.WebSocketServerProtocol, path: str):

        listener = WebsocketListener(websocket)

        self._listeners.append(listener)

        logger.info("New websocket client from %s has been connected. Listeners: %s", listener.remote_addr, len(self._listeners))

        while True:
            try:
                raw_msg = yield from websocket.recv()

                logger.debug("Received websocket message: %s", raw_msg)

                message = json.loads(raw_msg)

                action = message['action']
                diff = message['diff']

                if not self._dashboard_config_loader.is_loaded:
                    self._dashboard_config_loader.data = default_dashboard_data

                dict_merge(diff['added'], self._dashboard_config_loader.data)
                dict_merge(diff['updated'], self._dashboard_config_loader.data)

                def find_removed_node(node: dict, data: dict):
                    for key, value in node.items():
                        if value is None:
                            del data[key]
                        else:
                            find_removed_node(value, data[key])

                find_removed_node(diff['deleted'], self._dashboard_config_loader.data)

                # TODO: delay with some sec (and add if new trigger)
                self._dashboard_config_loader.dump()

                dispatch_listeners = list(filter(lambda l: l != listener, self._listeners))

                # TODO: implement throttling action log file write

                if dispatch_listeners:

                    action['time'] = time()
                    action_msg = json.dumps(action)

                    logger.debug("Action dispatch to %s listener(s)", len(dispatch_listeners))
                    for listn in dispatch_listeners:
                        listn.send(action_msg)

            except websockets.ConnectionClosed:
                break

        self._listeners.remove(listener)
        logger.info("Websocket client connection has been closed by %s. Listeners: %s", listener.remote_addr, len(self._listeners))

    def listen(self):
        loop = asyncio.get_event_loop()

        # Create the server.
        start_server = websockets.serve(self.new_listener, self._host, self._port)
        server = loop.run_until_complete(start_server)

        # Run the server until SIGTERM.
        stop = asyncio.Future()
        loop.add_signal_handler(signal.SIGTERM, stop.set_result, None)
        loop.run_until_complete(stop)

        # Shut down the server.
        server.close()
        loop.run_until_complete(server.wait_closed())
