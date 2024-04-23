from . import index
from flask import jsonify
import requests

@index.route('/banner', methods=['GET'])
def index_router():
  response = requests.get('http://codercba.com:9002/banner')
  result = response.text
  return result