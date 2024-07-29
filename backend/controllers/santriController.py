from flask import request
from models import Session, Santri, School, Spp, SppSantri
from typing import List, Any, Dict, Optional, Tuple
from controllers import response
import json


def _school_parse_json(data:Optional[List[School]]) -> List[Dict[str, str]]:
    if data:
        results:List[Dict[str, str]] = []
        for value in data:
            results.append({
                'name':value.name,
                'school_uuid': value.school_uuid,
            })
        return results
    else:
        return []


def _santri_parse_json(data: Optional[Tuple[Santri, School]]) -> Dict[str, Any]:
    if data:
        santri: Santri = data[0]
        school: School = data[1]
        return {
            'santri_uuid': santri.santri_uuid,
            'name': santri.name,
            'nis': santri.nis,
            'address': santri.address,
            'parent': santri.parent,
            'gender': santri.gender,
            'yatim': santri.yatim,
            'school_name': school.name, 
            'school_uuid': school.school_uuid, 
        }
    else:
        return {}
    

def _santri_parse_json_list(data: Optional[List[Tuple[Santri, School]]]) -> List[Dict[str, Any]]:
    if data:
        results: List[Dict[str, Any]] = []
        for value in data:
            results.append(_santri_parse_json(value))
        return results
    else:
        return []
    

def _santri_count(data:Optional[List[Santri]]) -> Tuple[int, int]:
    putra:int = 0
    putri:int = 0
    if(data):
        for value in data:
            if value.gender.lower() == 'l':
                putra += 1
            elif value.gender.lower() == 'p':
                putri += 1
    return putra, putri


def addSchool():
    session = Session()
    try:
        data:Dict[str, Any] = json.loads(request.get_data())
        school_name:str = data.get('name') if data else None
        if school_name:
            school = School(name=school_name)
            session.add(school)
            session.commit()
            return response(status_code=200, message='add school success')
        else:
            return response(status_code=400, message='requires name')
    except Exception as e:
        return response(status_code=500, message=f'Internal server error: {str(e)}')
    finally:
        session.close()
    

def updateSchool():
    session = Session()
    try:
        data:Dict[str, Any] = json.loads(request.get_data())
        school_name:str = data.get('name') if data else None
        school_uuid:str = data.get('school_uuid') if data else None
        if school_name and school_uuid:
            school = session.query(School).filter(School.school_uuid == school_uuid).first()
            school.name = school_name
            session.merge(school)
            session.commit()
            return response(status_code=200, message='update school success')
        else:
            return response(status_code=400, message='requires name and school_uuid')
    except Exception as e:
        return response(status_code=500, message=f'Internal server error: {str(e)}')
    finally:
        session.close()
    

def getSchool():
    session = Session()
    try:
        schools = session.query(School).all()
        school_json = _school_parse_json(schools)
        return response(status_code=200, message='get data success', data=school_json)
    except Exception as e:
        return response(status_code=500, message=f'Internal server error: {str(e)}')
    finally:
        session.close()


def addSantri():
    session = Session()
    try:
        data:Dict[str, Any] = json.loads(request.get_data())
        school_uuid:str = data.get('school_uuid') if data else None
        name:str = data.get('name') if data else None
        nis:str = data.get('nis') if data else None
        address:str = data.get('address') if data else None
        parent:str = data.get('parent') if data else None
        gender:str = data.get('gender') if data else None
        yatim:bool = data.get('yatim') if data else None
        if school_uuid and name and nis and address and parent and gender:
            school = session.query(School).filter(School.school_uuid == school_uuid).first()
            santri = Santri(
                school_id= school.school_id,
                name= name,
                nis= nis,
                address= address,
                parent= parent,
                gender= gender,
                yatim= yatim,
            )
            session.add(santri)
            session.commit()
            return response(status_code=200, message='add santri success')
        else:
            return response(status_code=400, message='requires school_uuid, name, nis, address, parent, yatim and gender')
    except Exception as e:
        return response(status_code=500, message=f'Internal server error: {str(e)}')
    finally:
        session.close()


def updateSantri():
    session = Session()
    try:
        data:Dict[str, Any] = json.loads(request.get_data())
        school_uuid:str = data.get('school_uuid') if data else None
        santri_uuid:str = data.get('santri_uuid') if data else None
        name:str = data.get('name') if data else None
        nis:str = data.get('nis') if data else None
        address:str = data.get('address') if data else None
        parent:str = data.get('parent') if data else None
        gender:str = data.get('gender') if data else None
        yatim:bool = data.get('yatim') if data else None
        if school_uuid and santri_uuid and name and nis and address and parent and gender and yatim:
            school = session.query(School).filter(School.school_uuid == school_uuid).first()
            santri = session.query(Santri).filter(Santri.santri_uuid == santri_uuid).first()
            santri.name = name
            santri.nis = nis
            santri.address = address
            santri.parent = parent
            santri.gender = gender
            santri.yatim = yatim
            santri.school_id = school.school_id
            session.merge(santri)
            session.commit()
            return response(status_code=200, message='update santri success')
        else:
            return response(status_code=400, message='requires school_uuid, santri_uuid, name, nis, address, parent, yatim and gender')
    except Exception as e:
        return response(status_code=500, message=f'Internal server error: {str(e)}')
    finally:
        session.close()


def getAllSantri():
    session = Session()
    try:
        santri = session.query(Santri, School).join(School, Santri.school_id == School.school_id).all()
        santri_parse = _santri_parse_json_list(santri)
        return response(status_code=200, message='get data success', data=santri_parse)
    except Exception as e:
        return response(status_code=500, message=f'Internal server error: {str(e)}')
    finally:
        session.close()


def getSantriByGender():
    session = Session()
    try:
        gender:str = request.args.get('g')
        if gender:
            santri = session.query(Santri, School).join(School, Santri.school_id == School.school_id).filter(Santri.gender == gender.lower()).all()
            school = session.query(School).all()
            santri_parse = _santri_parse_json_list(santri)
            school_pares = _school_parse_json(school)
            return response(status_code=200, message='get data success', data={"school":school_pares, "santri":santri_parse})
        else:
            return response(status_code=400, message='requires g[l/p] params')
    except Exception as e:
        return response(status_code=500, message=f'Internal server error: {str(e)}')
    finally:
        session.close()


def _check_exists(id:int,spp_santri:List[SppSantri]) -> bool:
    for value in spp_santri:
        if value.spp_id == id:
            return False
    return True


def _total_tagihan(spp:Spp,yatim:bool) -> Dict[str,Any]:
    total = spp.nominal_kosma + spp.nominal_spp
    if yatim:
        total = total - 100000
    return {
        "spp_uuid": spp.spp_uuid,
        "year": spp.year,
        "month": spp.month,
        "nominal_spp": spp.nominal_spp,
        "nominal_kosma": spp.nominal_kosma,
        "total": total
    }


def _get_tagihan_santri(spp:List[Spp],spp_santri:List[SppSantri],yatim:bool) -> Dict[str,Any]:
    total:int = 0
    tagihan:List[Dict[str,Any]] = []
    for value in spp:
        if _check_exists(value.spp_id,spp_santri):
            result = _total_tagihan(value,yatim)
            count:int = result.get('total')
            total = total + count
            tagihan.append(result)
    return {
        "total": total,
        "spp": tagihan
    }


def getSantriByNIS():
    session = Session()
    try:
        nis:str = request.args.get('nis')
        if nis:
            santri = session.query(Santri, School).join(School, Santri.school_id == School.school_id).filter(Santri.nis==nis).first()
            if santri:
                spp_santri = session.query(SppSantri).filter(SppSantri.santri_id == santri[0].santri_id).all()
                spp = session.query(Spp).all()
                santri_parse = _santri_parse_json(santri)
                tagihan = _get_tagihan_santri(spp,spp_santri,santri[0].yatim)
                return response(
                    status_code=200,
                    message='get data success',
                    data={
                        "santri":santri_parse,
                        "tagihan":tagihan
                    }
                )
            else:
                return response(status_code=200, message='No data found')
        else:
            return response(status_code=400, message='requires nis params')
    except Exception as e:
        return response(status_code=500, message=f'Internal server error: {str(e)}')
    finally:
        session.close()


def getAllData():
    session = Session()
    try:
        santri = session.query(Santri).all()
        school = session.query(School).all()
        school_length = len(school)
        putra, putri = _santri_count(santri)
        return response(
            status_code=200,
            message='get data success',
            data={
                'putri':putri,
                'putra':putra,
                "sekolah":school_length
            }
        )
    except Exception as e:
        return response(status_code=500, message=f'Internal server error: {str(e)}')
    finally:
        session.close()