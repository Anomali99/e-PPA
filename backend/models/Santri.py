from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import uuid

Base = declarative_base()

class School(Base):
    __tablename__ = 'school'
    school_id = Column(Integer, primary_key=True, autoincrement=True)
    school_uuid = Column(String, nullable=False, default=lambda: str(uuid.uuid4()))
    name = Column(String(30), nullable=False)
    
    santris = relationship('Santri', back_populates='school')

class Santri(Base):
    __tablename__ = 'santri'
    santri_id = Column(Integer, primary_key=True, autoincrement=True)
    santri_uuid = Column(String, nullable=False,  default=lambda: str(uuid.uuid4()))
    school_id = Column(Integer, ForeignKey('school.school_id'), nullable=False)
    name = Column(String(100), nullable=False)
    nis = Column(String(20), nullable=False)
    address = Column(String, nullable=False)
    parent = Column(String(30), nullable=False)
    gender = Column(String(1), nullable=False)
    yatim = Column(Boolean, nullable=False)
    
    school = relationship('School', back_populates='santris')
