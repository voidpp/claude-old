from setuptools import setup, find_packages

setup(
    name = "claude",
    description = "claude",
    long_description = "claude",
    author = "Lajos Santa",
    author_email = "santa.lajos@gmail.com",
    url = "https://github.com/voidpp/claude",
    license = "MIT",
    use_scm_version = True,
    setup_requires = ["setuptools_scm"],
    install_requires = [
        "SQLAlchemy~=1.3",
        "alembic~=1.0",
        "graphene~=2.1",
        "graphene-sqlalchemy~=2.2",
        "flask~=1.1",
        "transmissionrpc~=0.11",
        "configpp~=0.3",
    ],
    include_package_data = True,
    packages = [],
    extras_require = {},
    scripts = [],
    classifiers = [],
)
