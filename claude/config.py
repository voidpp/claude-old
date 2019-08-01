import logging
import logging.config

from dataclasses import dataclass
from configpp.tree import Tree, Settings, NodeBase, DatabaseLeaf
from configpp.soil import Group, GroupMember

logger = logging.getLogger(__name__)

tree = Tree(Settings(convert_underscores_to_hypens = True))

@tree.root()
class AppConfig:

    port: int
    host = '0.0.0.0'
    sync_log_size: str

dashboard_config_loader = GroupMember('dashboards.json', mandatory = False)
app_config_loader = GroupMember('app.yaml')
logger_config_loader = GroupMember('logger.yaml')

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
