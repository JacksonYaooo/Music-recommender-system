from . import index
from flask import jsonify
from app.mongo import mongo
import requests

@index.route('/banner', methods=['GET'])
def index_banner():
  response = requests.get('http://codercba.com:9002/banner')
  result = response.text
  return result

@index.route('/newSongs', methods=['GET'])
def index_newSongs():
  response = requests.get('http://localhost:3000/top/song?type=7')
  result = response.text
  return result