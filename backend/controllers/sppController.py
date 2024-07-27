from flask import request
from models import Session, Spp, Santri, SppSantri
from typing import Any, List, Dict, Optional, Tuple
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
                'spp_uuid': value.spp_uuid
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


def _get_uniqe_data(data:List[Dict[str,Any]]) -> Tuple[List[str],List[str]]:
    santri = set()
    spp = set()
    for value in data:
        santri.add(value.get('santri_uuid'))
        spp.add(value.get('spp_uuid'))
    return list(santri), list(spp)


def _check_add_spp_handle(data:List[Dict[str,Any]]) -> List[Dict[str,Any]]:
    results:List[Dict[str,Any]] = []
    for value in data:
        spp_santri_uuid:str = value.get('spp_santri_uuid')
        santri_uuid:str = value.get('santri_uuid')
        spp_uuid:str = value.get('spp_uuid')
        if spp_uuid == spp_santri_uuid and spp_santri_uuid and santri_uuid and spp_uuid:
            results.append({
                "santri_uuid":santri_uuid,
                "spp_uuid":spp_uuid,
            })
    return results


def _this_santri(santri:List[Santri], uuid:str) -> Optional[Santri]:
    for value in santri:
        if value.santri_uuid == uuid:
            return value
    return None


def _this_spp(spp:List[Spp], uuid:str) -> Optional[Spp]:
    for value in spp:
        if value.spp_uuid == uuid:
            return value
    return None


def _add_spp_santri_handle(data:List[Dict[str,Any]], santri:List[Santri], spp:List[Spp]) -> List[SppSantri]:
    results:List[SppSantri] = []
    for value in data:
        this_santri = _this_santri(santri,value.get("santri_uuid"))
        this_spp = _this_spp(spp,value.get("spp_uuid"))
        results.append(SppSantri(
                santri_id= this_santri.santri_id,
                spp_id= this_spp.spp_id,
        ))
    return results


def addSppSantri():
    session = Session()
    try:
        data:List[Dict[str,Any]] = json.loads(request.get_data()) 
        if data:
            filter_result = _check_add_spp_handle(data)
            uniqe_result = _get_uniqe_data(filter_result)
            santri = session.query(Santri).filter(Santri.santri_uuid.in_(uniqe_result[0])).all()
            spp = session.query(Spp).filter(Spp.spp_uuid.in_(uniqe_result[1])).all()
            spp_santri = _add_spp_santri_handle(filter_result,santri,spp)
            for value in spp_santri:
                session.add(value)
            # session.add_all(spp_santri)
            session.commit()
            return response(status_code=200, message='add spp santri success')
        else:
            return response(status_code=400, message='requires data')
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


def _get_santri_payment(spp_santri:Optional[List[SppSantri]],spp_id:str,santri_id:str) -> Optional[str]:
    if(spp_santri):
        for value in spp_santri:
            if value.spp_id == spp_id and value.santri_id == santri_id:
                return value.spp_santri_uuid
    return None


def _get_spp_payments(spp:Optional[List[Spp]],spp_santri:Optional[List[SppSantri]],santri_id:str) -> Tuple[List[Dict[str,Any]],int]:
    if(spp):
        result:List[Dict[str,Any]] = []
        total:int = 0
        for value in spp:
            santri_payment = _get_santri_payment(spp_santri,value.spp_id,santri_id)
            if santri_payment == None:
                total = total + value.nominal
            result.append({
                "spp_uuid": value.spp_uuid,
                "year": value.year,
                "month": value.month,
                "spp_santri_uuid": santri_payment if santri_payment else ''
            })
        return result, total
    else:
        return [], 0


def _spp_santri_handler(santri:Optional[List[Santri]],spp:Optional[List[Spp]],spp_santri:Optional[List[SppSantri]]) -> List[Dict[str,Any]]:
    if(santri):
        results:List[Dict[str,Any]] = []
        for value in santri:
            spp_result = _get_spp_payments(spp,spp_santri,value.santri_id)
            results.append({
                "santri_uuid":value.santri_uuid,
                "name": value.name,
                "spp":spp_result[0],
                "gender": value.gender,
                "total": spp_result[1]
            })
        return results
    else:
        return []


def getSppSantri():
    session = Session()
    try:
        spp = session.query(Spp).all()
        santri = session.query(Santri).all()
        spp_santri = session.query(SppSantri).all()
        santri_payments = _spp_santri_handler(santri,spp,spp_santri)
        spp_parse = _spp_parse_json(spp)
        return response(
            status_code=200,
            message='get data success',
            data={
                "spp": spp_parse,
                "santri": santri_payments
            }
        )
    except Exception as e:
        return response(status_code=500, message=f'Internal server error: {str(e)}')
    finally:
        session.close()