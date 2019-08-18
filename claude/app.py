import asyncio
import logging
import os
from time import sleep, time

import pkg_resources
from aiohttp import web
from jinja2 import Template

from .api import Api
from .config import Mode, dashboard_config_loader, default_dashboard_data, load
from .config_sync_service import config_sync
from .javascript_libraries import javascript_libraries
from .memcache import create_memcache_client

config = load()

memcache = create_memcache_client(config.cache.host, config.cache.port) if config.cache.port else None

logger = logging.getLogger(__name__)

if not config:
    print('no config')
    exit(1)

aio_app = web.Application()

current_directory = os.path.dirname(__file__)

with open(os.path.join(current_directory, 'templates/index.html')) as f:
    index_template = Template(f.read())

async def index(request):

    debug = os.environ.get('CLAUDE_DEBUG_MODE')

    mode = Mode.DEVELOPMENT if debug else Mode.PRODUCTION

    version = str(time()) if debug else pkg_resources.get_distribution("claude").version
    try:
        # need to reload every time when the dashboard app started because the config sync service writes the dashboard file
        dashboard_config_loader.load()
    except FileNotFoundError:
        # first run, there is no dashboard config
        pass

    resp_text = index_template.render(version = version,
                                      dev_mode = mode == Mode.DEVELOPMENT,
                                      initial_data = dashboard_config_loader.data or default_dashboard_data,
                                      javascript_libraries = javascript_libraries[mode],
                                      )

    return web.Response(body = resp_text, content_type = 'text/html')

Api(aio_app, config, memcache)

aio_app.router.add_get('/', index)
aio_app.router.add_static('/static', os.path.join(current_directory, 'static'))
aio_app.router.add_route('GET', '/config-sync', config_sync)
