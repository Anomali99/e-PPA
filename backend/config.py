import os, datetime
from dotenv import load_dotenv

load_dotenv() 

_host:str = os.environ.get("DB_HOST")
_user:str = os.environ.get("DB_USER")
_password:str = os.environ.get("DB_PASSWORD")
_dbport:str = os.environ.get("DB_PORT")
_dbname:str = os.environ.get("DB_NAME")

basedir = os.path.abspath(os.path.dirname(__file__))

SQLALCHEMY_DATABASE_URI= f"mysql+pymysql://{_user}:{_password}@{_host}:{_dbport}/{_dbname}?charset=utf8mb4"
SQLALCHEMY_TRACK_MODIFICATIONS= False
SECRET_KEY = "qwerty"
JWT_EXPIRATION_DELTA = datetime.timedelta(hours=12)
DEBUG = True