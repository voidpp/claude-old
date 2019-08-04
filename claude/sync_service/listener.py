import logging
from typing import List

from websockets import WebSocketServerProtocol
from cached_property import cached_property


logger = logging.getLogger(__name__)

class WebsocketListener:

    def __init__(self, websocket: WebSocketServerProtocol):
        self._websocket = websocket
        self._remote_addr = websocket.remote_address[0]

    @cached_property
    def remote_addr(self) -> str:
        return self._remote_addr

    def send(self, message: str):
        logger.debug("Send message: %s to %s", message, self.remote_addr)
        self._websocket.send(message)

WebsocketListenerList = List[WebsocketListener]
