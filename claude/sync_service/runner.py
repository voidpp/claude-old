import logging

from claude.config import load, dashboard_config_loader

from claude.sync_service.server import Server

logger = logging.getLogger('claude.sync_server')

# start with uwsgi: --mule=claude.sync_server:run
def run():
    config = load()

    server = Server(config.sync_server.port, dashboard_config_loader)

    logger.info('Sync server listeing on %d', config.sync_server.port)

    server.listen()

# for developement purposes
if __name__ == '__main__':
    run()
