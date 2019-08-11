from lxml import etree
import subprocess
import re
from flask import jsonify, request, Flask, Blueprint
import logging
from requests import get
from io import StringIO

from .tools import parse_temp, tree_search

logger = logging.getLogger(__name__)

ping_pattern = re.compile(r'64 bytes from ([0-9\.]{7,15}): icmp_.eq=([0-9]{1,2}) ttl=([0-9]{1,4}) time=([0-9\.]{1,7}) ms')

api = Blueprint('api', __name__)

@api.route('/api/server-status', methods = ['POST'])
def api_server_status():
    config = request.json
    ip = config['ip']
    status_server_port = config['statusServerPort']

    cnt = 4
    try:
        logger.debug("Pinging %s ...", ip)
        ping_raw = subprocess.check_output('ping %s -c %d -i 0.2' % (ip, cnt), shell = True)
    except subprocess.CalledProcessError:
        logger.info("Ping command failed on %s", ip)
        return jsonify({'ping': None})

    time_sum = 0
    for match in re.finditer(ping_pattern, ping_raw.decode()):
        time_sum += float(match.group(4))

    try:
        server_details = get('http://%s:%s/' % (ip, status_server_port)).json()
    except Exception as e:
        logger.info("Cannot reach %s:%s because %s", ip, status_server_port, e)
        server_details = {}

    return jsonify({
        'ping': round(time_sum / cnt, 1),
        **server_details,
    })

@api.route('/api/idokep/current/<city>')
def idokep_current(city):
    base_url = 'https://www.idokep.hu'

    parser = etree.HTMLParser()

    response = get('%s/idojaras/%s' % (base_url, city))
    tree = etree.parse(StringIO(response.text), parser)

    current_container = tree_search('.fooldal-elorejelzes .jelenlegi', tree)

    res = {
        'img': base_url + tree_search('.icon > svg > image', current_container).attrib['xlink:href'],
        'value': parse_temp(tree_search('.homerseklet', current_container).text),
    }

    return jsonify(res)
