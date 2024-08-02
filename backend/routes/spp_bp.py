from flask import Blueprint
from controllers import sppController
from auth.Auth import auth

spp_bp = Blueprint('spp_bp', __name__)

spp_bp.route('/', methods=['GET'])(auth.login_required(sppController.getSppAll))
spp_bp.route('/', methods=['POST'])(auth.login_required(sppController.addSpp))
spp_bp.route('/', methods=['PUT'])(auth.login_required(sppController.updateSpp))
spp_bp.route('/', methods=['DELETE'])(auth.login_required(sppController.deleteSpp))

spp_bp.route('/santri', methods=['GET'])(auth.login_required(sppController.getSppSantri))
spp_bp.route('/santri', methods=['POST'])(auth.login_required(sppController.addSppSantri))

spp_bp.route('/upload', methods=['GET'])(auth.login_required(sppController.getUploadImage))
spp_bp.route('/upload', methods=['POST'])(sppController.uploadImage)