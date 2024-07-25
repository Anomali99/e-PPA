from flask_httpauth import HTTPTokenAuth
from flask import jsonify
import jwt, datetime, config

auth = HTTPTokenAuth(scheme='Bearer')

def generate_token(username):
    expiration = datetime.datetime.utcnow() + config.JWT_EXPIRATION_DELTA
    token = jwt.encode({'username': username, 'exp': expiration}, config.SECRET_KEY, algorithm='HS256')
    return token

@auth.verify_token
def verify_token(token):
    try:
        data = jwt.decode(token, config.SECRET_KEY, algorithms=['HS256'])
        return data['username']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
    
@auth.error_handler
def unauthorized_response():
    return jsonify({
        'status': 401, 
        'message': 'Unauthorized access, invalid or expired token'
        }), 401, {'ContentType':'application/json'}