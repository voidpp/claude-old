
from configpp.tree import Tree, Settings, NodeBase, DatabaseLeaf
from configpp.soil import Config


tree = Tree(Settings(convert_underscores_to_hypens = True))

@tree.root()
class AppConfig:

    database: str


config_loader = Config('claude.yaml')

def load() -> AppConfig:

    if not config_loader.load():
        return None

    return tree.load(config_loader.data)
