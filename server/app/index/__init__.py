from flask import Blueprint

index = Blueprint("index", __name__, url_prefix="/index")
# import app.index.views
from . import views