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
        "flask~=1.1",
        "transmissionrpc~=0.11",
        "Flask-Sockets~=0.2",
        "configpp~=0.3",
    ],
    include_package_data = True,
    packages = [],
    extras_require = {},
    scripts = [
        "bin/run-claude-server"
    ],
    classifiers = [],
)
