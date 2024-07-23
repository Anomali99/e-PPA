from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import uuid

Base = declarative_base()

class School(Base):
    __tablename__ = 'school'
    school_id:int = Column(Integer, primary_key=True, autoincrement=True)
    school_uuid:str = Column(String, nullable=False, default=str(uuid.uuid4()))
    name:str = Column(String(30), nullable=False)


class Santri(Base):
    __tablename__ = 'santri'
    santri_id:int = Column(Integer, primary_key=True, autoincrement=True)
    santri_uuid:str = Column(String, nullable=False,  default=str(uuid.uuid4()))
    school_id:int = Column(Integer, ForeignKey('school.school_id'), nullable=False)
    name:str = Column(String(100), nullable=False)
    nis:str = Column(String(20), nullable=False)
    address:str = Column(String, nullable=False)
    parent:str = Column(String(30), nullable=False)
    gender:str = Column(String(1), nullable=False)
    
    school = relationship('School', back_populates='school')
