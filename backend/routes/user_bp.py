from flask import Blueprint
from controllers.usersController import login

user_bp = Blueprint('user_bp', __name__)

user_bp.route('/login', methods=['POST'])(login)