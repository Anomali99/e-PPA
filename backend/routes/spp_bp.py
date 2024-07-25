from flask import Blueprint
from controllers import sppController
from auth.Auth import auth

spp_bp = Blueprint('spp_bp', __name__)

spp_bp.route('/', methods=['GET'])(auth.login_required(sppController.getSppAll))
spp_bp.route('/', methods=['POST'])(auth.login_required(sppController.addSpp))
spp_bp.route('/santri', methods=['POST'])(auth.login_required(sppController.addSppSantri))