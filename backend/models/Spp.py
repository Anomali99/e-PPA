from sqlalchemy import Column, Integer, String, DateTime, Date, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import uuid

Base = declarative_base()

class Spp(Base):
    __tablename__ = 'spp'
    spp_id:int = Column(Integer, primary_key=True, autoincrement=True)
    spp_uuid:str = Column(String, nullable=False, default=str(uuid.uuid4()))
    month:str = Column(String(10), nullable=False)
    year:str = Column(String(4), nullable=False)
    nominal:int = Column(Integer, nullable=False)


class SppSantri(Base):
    __tablename__ = 'spp_santri'
    spp_santri_id:int = Column(Integer, primary_key=True, autoincrement=True)
    spp_santri_uuid:str = Column(String, nullable=False, default=str(uuid.uuid4()))
    santri_id:int = Column(Integer,  ForeignKey('santri.santri_id'), nullable=False)
    spp_id:int = Column(Integer,  ForeignKey('spp.spp_id'), nullable=False)
    datetime = Column(DateTime, nullable=False)

    santri = relationship('Santri', back_populates='santri')
    spp = relationship('Spp', back_populates='spp')