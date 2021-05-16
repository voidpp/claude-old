import os

from invoke import Collection


from tasks.assets import Frontend, MultiprocessTask

mp_tasks = MultiprocessTask('all')


@mp_tasks.add
def uvicorn(c, reload = True):
    from buck.components.keys import Keys
    cmd = ""
    if reload:
        cmd += " --reload "
    os.environ[Keys.DEV_MODE] = "1"
    c.run(f"uvicorn buck.app:app --host 0.0.0.0 --port 9000 " + cmd)


@mp_tasks.add
def webpack(c):
    Frontend.transpile(c, True)


@mp_tasks.add
def celery(c):
    c.run("celery -A buck.celery.app worker --loglevel=info --statedb=./celery.state")


start_collection = Collection('start')
mp_tasks.add_to_collection(start_collection)
