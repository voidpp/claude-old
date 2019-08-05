import logging
import logging.config

from enum import Enum

from configpp.tree import Tree, Settings
from configpp.soil import Group, GroupMember

class Mode(Enum):

    DEVELOPMENT = 'development'
    PRODUCTION = 'production'

logger = logging.getLogger(__name__)

tree = Tree(Settings(convert_underscores_to_hypens = True))

@tree.root()
class AppConfig:

    @tree.node()
    class sync_server:
        port: int

    sync_log_size: str

dashboard_config_loader = GroupMember('dashboards.json', mandatory = False)
app_config_loader = GroupMember('app.yaml')
logger_config_loader = GroupMember('logger.yaml')

default_dashboard_data = {
    'dashboards': {},
    'widgets': {},
}

config_loader = Group('claude', [app_config_loader, dashboard_config_loader, logger_config_loader])

def load() -> AppConfig:

    if not config_loader.load():
        return None

    logging.config.dictConfig(logger_config_loader.data)

    logger.info("Config loaded from %s (dashboard: %s)", config_loader.path, dashboard_config_loader.is_loaded)
    logger.info("App config: %s", app_config_loader.data)
    logger.info("Dashboard: %s", dashboard_config_loader.data)

    # TODO: handle empty dashboard_config_loader.data

    return tree.load(app_config_loader.data)
