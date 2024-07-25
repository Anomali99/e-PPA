import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import SQLALCHEMY_DATABASE_URI


Engine  = create_engine(SQLALCHEMY_DATABASE_URI)
Session = sessionmaker(bind=Engine)


from .Santri import Santri, School
from .Spp import Spp, SppSantri
from .Users import Users