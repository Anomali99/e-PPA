from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .Santri import Base, Santri
import uuid, datetime


class Spp(Base):
    __tablename__ = 'spp'
    spp_id:int = Column(Integer, primary_key=True, autoincrement=True)
    spp_uuid:str = Column(String, nullable=False, default=lambda: str(uuid.uuid4()))
    month:str = Column(String(10), nullable=False)
    year:str = Column(String(4), nullable=False)
    nominal_spp:int = Column(Integer, nullable=False)
    nominal_kosma:int = Column(Integer, nullable=False)
    
    spp_santris = relationship('SppSantri', back_populates='spp')


class SppSantri(Base):
    __tablename__ = 'spp_santri'
    spp_santri_id:int = Column(Integer, primary_key=True, autoincrement=True)
    spp_santri_uuid:str = Column(String, nullable=False, default=lambda: str(uuid.uuid4()))
    santri_id:int = Column(Integer,  ForeignKey('santri.santri_id'), nullable=False)
    spp_id:int = Column(Integer,  ForeignKey('spp.spp_id'), nullable=False)
    datetime = Column(DateTime, nullable=False, default=datetime.datetime.now())

    spp = relationship('Spp', back_populates='spp_santris')


class Upload(Base):
    __tablename__ = 'upload'
    upload_id:int = Column(Integer, primary_key=True, autoincrement=True)
    santri_id:int = Column(Integer,  ForeignKey('santri.santri_id'), nullable=False)
    filename:str = Column(String, nullable=False)
    datetime = Column(DateTime, nullable=False, default=datetime.datetime.now())



Santri.spp_santri = relationship('SppSantri', back_populates='santri')
SppSantri.santri = relationship('Santri', back_populates='spp_santri')
Santri.upload_image = relationship('Upload', back_populates='santri')
Upload.santri = relationship('Santri', back_populates='upload_image')