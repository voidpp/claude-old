from invoke import task


@task
def clean(c):
    """remove recursively generated and cache files (*.pyc, __generated__) """
    from pathlib import Path
    import shutil
    for path in Path().rglob('*.pyc'):
        path.unlink()

    for path in Path().rglob('__generated__'):
        shutil.rmtree(path)

    print("*.pyc and __generated__ directories deleted")


@task
def build(c):
    from tasks.typescript import build
    build(c, "production")
    c.run("poetry build")
