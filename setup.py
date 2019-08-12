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
        "websockets~=8.0",
        "requests~=2.22",
        "cached-property~=1.5",
        "configpp~=0.3",
        "lxml~=4.4",
        "pymemcache~=2.2",
        "cssselect~=1.1",
    ],
    include_package_data = True,
    packages = [],
    extras_require = {},
    classifiers = [],
)
