from . import index
from flask import jsonify

@index.route('/', methods=['GET'])
def index_router():
    print(1111)
    return '111111'