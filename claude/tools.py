import logging
from functools import wraps

from flask import current_app, request, jsonify
from lxml.cssselect import CSSSelector

from claude.config import AppConfig
from claude.memcache import MemcacheClient

logger = logging.getLogger(__name__)

def dict_merge(source, destination):
    """
    run me with nosetests --with-doctest file.py

    >>> a = { 'first' : { 'all_rows' : { 'pass' : 'dog', 'number' : '1' } } }
    >>> b = { 'first' : { 'all_rows' : { 'fail' : 'cat', 'number' : '5' } } }
    >>> dict_merge(b, a) == { 'first' : { 'all_rows' : { 'pass' : 'dog', 'fail' : 'cat', 'number' : '5' } } }
    True
    """
    for key, value in source.items():
        if isinstance(value, dict):
            # get node or create one
            node = destination.setdefault(key, {})
            dict_merge(value, node)
        else:
            destination[key] = value

    return destination


def parse_temp(temp: str) -> int:
    """This magnificent function iterates throught the string and if found a non int char, breaks"""

    number = ""
    for char in temp:
        try:
            int(char)
            number += char
        except:
            break
    return number if int(number) else None


def tree_search(selector, tree, return_first = True):
    sel = CSSSelector(selector)
    res = sel(tree)
    if not len(res):
        return None
    return res[0] if return_first else res


def get_config() -> AppConfig:
    return current_app.config['APP_CONFIG']

def get_memcache() -> MemcacheClient:
    return current_app.config['MEMCACHE']

def cache_result(expiry_config_key):
    def wrapper(func):
        @wraps(func)
        def controller(*args, **kwargs):
            mc = get_memcache()
            cache_key = request.path
            if mc:
                data = mc.get(cache_key)
                if data and not request.args.get('force-refetch'):
                    logger.debug("Data for '%s' comes from cache", cache_key)
                    return jsonify(data)

            res = func(*args, **kwargs)

            if mc:
                expiry = getattr(get_config().cache.expiry, expiry_config_key)
                if expiry:
                    mc.set(cache_key, res, expiry)

            return jsonify(res)

        return controller
    return wrapper
