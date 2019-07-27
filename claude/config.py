
from configpp.tree import Tree, Settings, NodeBase
from configpp.soil import Config


tree = Tree(Settings(convert_underscores_to_hypens = True))

class ServerConfig(NodeBase):

    ip: str
    name: str
    details_url: str
    location: str

    def serialize(self):
        return self.__dict__

@tree.root()
class AppConfig:

    servers = tree.list_node([ServerConfig])

config_loader = Config('claude.yaml')

def load() -> AppConfig:

    if not config_loader.load():
        return None

    return tree.load(config_loader.data)
