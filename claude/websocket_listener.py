import logging
from typing import List

from geventwebsocket.websocket import WebSocket

logger = logging.getLogger(__name__)

class WebsocketListener:

    def __init__(self, websocket: WebSocket):
        self._websocket = websocket
        self._remote_addr = websocket.environ.get('REMOTE_ADDR')

    @property
    def remote_addr(self) -> str:
        return self._remote_addr

    def send(self, message: str):
        logger.debug("Send message: %s to %s", message, self.remote_addr)
        self._websocket.send(message)

WebsocketListenerList = List[WebsocketListener]
