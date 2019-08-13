import logging
import re
import subprocess
from io import StringIO

from flask import jsonify, request, Blueprint
from lxml import etree
from requests import get

from .tools import parse_temp, tree_search, cache_result

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
@cache_result('idokep_current')
def idokep_current(city):

    base_url = 'https://www.idokep.hu'

    parser = etree.HTMLParser()

    logger.debug("Fetch data from %s", base_url)

    response = get('%s/idojaras/%s' % (base_url, city))
    tree = etree.parse(StringIO(response.text), parser)

    current_container = tree_search('.fooldal-elorejelzes .jelenlegi', tree)

    res = {
        'img': base_url + tree_search('.icon > svg > image', current_container).attrib['xlink:href'],
        'value': parse_temp(tree_search('.homerseklet', current_container).text),
    }

    return res

@api.route('/api/idokep/days/<city>')
@cache_result('idokep_days')
def idokep_days(city):

    base_url = 'https://www.idokep.hu'

    parser = etree.HTMLParser()

    logger.debug("Fetch data from %s", base_url)
    response = get('%s/elorejelzes/%s' % (base_url, city))
    tree = etree.parse(StringIO(response.text), parser)

    day_columns = tree_search('.huszonegy .oszlop', tree, False)

    res = []

    for day_column in day_columns:
        day_cell = tree_search('.nap-box > div', day_column)
        if day_cell is None:
            continue

        precipitation_val = 0
        precipitation_prob = 0

        csapadek_tree = tree_search('.csapadek', day_column)
        if csapadek_tree is not None:
            prec_val_text = tree_search('.buborek-lent .buborek-sor .buborek-text .csapadek-text', csapadek_tree).text
            prec_prob_text = tree_search('.buborek-lent .buborek-sor .buborek-text .valoszinuseg', csapadek_tree).text
            precipitation_val = re.search(r'Kb\. ([\d]{1,}) mm', prec_val_text).group(1)
            precipitation_prob = re.search(r'.+ ([\d]{1,})%', prec_prob_text).group(1)

        day_data = {
            'img': base_url + tree_search('.icon > svg > image', day_column).attrib['xlink:href'],
            'day': int(day_cell.text),
            'max': int(tree_search('[class^="max-homerseklet-"]', day_column).text.strip()),
            'min': int(tree_search('[class^="min-homerseklet-"]', day_column).text.strip()),
            'precipitation': {
                'value': int(precipitation_val),
                'probability': int(precipitation_prob),
            },
        }
        res.append(day_data)

    return res
