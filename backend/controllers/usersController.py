from werkzeug.security import generate_password_hash, check_password_hash
from typing import Any, Dict
from flask import request
from getpass import getpass
from models import Session, Users
from controllers import response
from auth import Auth
import json

def checkToken():
    print(1)
    return response(status_code=200,message='token valid')

def login():
    session =  Session()
    try:
        req:Dict[str, Any] = json.loads(request.get_data())
        username = req.get('username')
        password = req.get('password')
        user = session.query(Users).filter(Users.username == username).first()
        if user:
            if check_password_hash(user.password, password):
                token = Auth.generate_token(user.username)
                return response(
                    status_code=200,
                    message='login success',
                    data={
                        'user_uuid': user.user_uuid,
                        'username': user.username,
                        'token': token
                    }
                )
            else:
                return response(status_code=401, message='password wrong')
        else:
            return response(status_code=401, message='username not found')
    except Exception as e:
        return response(status_code=500, message='internal server error')
    finally:
        session.close()

def addUser():
    username = input("username: ")
    password = generate_password_hash(getpass("password: "))

    session = Session()
    user = Users(
        username=username,
        password=password
    )
    session.add(user)
    session.commit()
    session.close()
    print("success add user")