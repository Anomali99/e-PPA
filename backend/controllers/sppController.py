from flask import request
from models import Session, Spp, Santri, SppSantri
from typing import Any, List, Dict, Optional
from controllers import response
import json


def _spp_parse_json(data:Optional[List[Spp]]) -> List[Dict[str,Any]]:
    if data:
        results:List[Dict[str,Any]] = []
        for value in data:
            results.append({
                'year': value.year,
                'month': value.month,
                'nominal': value.nominal,
            })
        return results
    else:
        return []


def addSpp():
    session = Session()
    try:
        data:Dict[str,Any] = json.loads(request.get_data())
        month:str = data.get('month') if data else None
        year:str = data.get('year') if data else None
        nominal:int = int(data.get('nominal')) if data else None
        if month and year and nominal:
            spp = Spp(
                month=month,
                year=year,
                nominal=nominal,
            )
            session.add(spp)
            session.commit()
            return response(status_code=200, message='add spp success')
        else:
            return response(status_code=400, message='requires month, year and nominal')
    except Exception as e:
        return response(status_code=500, message=f'Internal server error: {str(e)}')
    finally:
        session.close()


def addSppSantri():
    session = Session()
    try:
        data:Dict[str,Any] = json.loads(request.get_data()) 
        santri_uuid:str = data.get('santri_uuid') if data else None
        spp_uuid:str = data.get('spp_uuid') if data else None
        if santri_uuid and spp_uuid:
            santri = session.query(Santri).filter(Santri.santri_uuid == santri_uuid).first()
            spp = session.query(Spp).filter(Spp.spp_uuid == spp_uuid).first()
            spp_santri = SppSantri(
                santri_id= santri.santri_id,
                spp_id= spp.spp_id,
            )
            session.add(spp_santri)
            session.commit()
            return response(status_code=200, message='add spp santri success')
        else:
            return response(status_code=400, message='requires santri_uuid and spp_uuid')
    except Exception as e:
        return response(status_code=500, message=f'Internal server error: {str(e)}')
    finally:
        session.close()


def getSppAll():
    session = Session()
    try:
        spp = session.query(Spp).all()
        spp_json = _spp_parse_json(spp)
        return response(status_code=200, message='get data success', data=spp_json)
    except Exception as e:
        return response(status_code=500, message=f'Internal server error: {str(e)}')
    finally:
        session.close()