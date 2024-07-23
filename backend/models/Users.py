from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
import uuid

Base = declarative_base()

class Users(Base):
    __tablename__ =  'users'
    user_id:int = Column(Integer, primary_key=True, autoincrement=True)
    user_uuid:str = Column(String, nullable=False, default=str(uuid.uuid4()))
    username:str = Column(String(30), nullable=False)
    password:str = Column(String, nullable=False)