from flask import Blueprint
from controllers import santriController
from auth.Auth import auth

santri_bp = Blueprint('santri_bp', __name__)

santri_bp.route('/', methods=['GET'])(auth.login_required(santriController.getAllSantri))
santri_bp.route('/', methods=['POST'])(auth.login_required(santriController.addSantri))
santri_bp.route('/', methods=['PUT'])(auth.login_required(santriController.updateSantri))
santri_bp.route('/', methods=['DELETE'])(auth.login_required(santriController.deleteSantri))

santri_bp.route('/school', methods=['GET'])(auth.login_required(santriController.getSchool))
santri_bp.route('/school', methods=['POST'])(auth.login_required(santriController.addSchool))
santri_bp.route('/school', methods=['PUT'])(auth.login_required(santriController.updateSchool))
santri_bp.route('/school', methods=['DELETE'])(auth.login_required(santriController.deleteSchool))

santri_bp.route('/bynis', methods=['GET'])(santriController.getSantriByNIS)
santri_bp.route('/bygender', methods=['GET'])(auth.login_required(santriController.getSantriByGender))
santri_bp.route('/all', methods=['GET'])(auth.login_required(santriController.getAllData))

