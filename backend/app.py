from flask import Flask, jsonify
from routes.santri_bp import santri_bp
from routes.user_bp import user_bp
from routes.spp_bp import spp_bp
from argparse import ArgumentParser, Namespace
from controllers.usersController import addUser
from flask_cors import CORS


app  = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*", "allow_headers": "Content-Type"}})

app.config.from_object('config')

app.register_blueprint(user_bp, url_prefix='/users')
app.register_blueprint(santri_bp, url_prefix='/santri')
app.register_blueprint(spp_bp, url_prefix='/spp')


parser = ArgumentParser()
parser.add_argument('--func', '-f')
args: Namespace = parser.parse_args()

if args.func is not None:
    match args.func:
        case 'addUser':
            addUser()
        case _:
            print("Function not recognized")

elif __name__ == '__main__':
    app.run(host='0.0.0.0', port=5127)