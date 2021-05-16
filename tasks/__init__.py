from invoke import Collection

from tasks import typescript, top, celery
from tasks.typescript import generate
from .start import start_collection

ns = Collection.from_module(top)

typescript_collection = Collection.from_module(typescript)
typescript_collection.add_collection(generate)

ns.add_collection(start_collection)
ns.add_collection(celery)
ns.add_collection(typescript_collection)
