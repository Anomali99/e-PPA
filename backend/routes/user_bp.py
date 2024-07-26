from flask import Blueprint
from controllers import usersController 
from auth.Auth import auth

user_bp = Blueprint('user_bp', __name__)

user_bp.route('/login', methods=['POST'])(usersController.login)
user_bp.route('/check', methods=['GET'])(auth.login_required(usersController.checkToken))