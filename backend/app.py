from flask import Flask
from routes.user_bp import user_bp
from argparse import ArgumentParser, Namespace
from controllers.usersController import addUser


app  = Flask(__name__)

app.config.from_object('config')
app.register_blueprint(user_bp, url_prefix='/users')

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