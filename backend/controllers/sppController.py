from flask import request
from models import Session, Spp, Santri, SppSantri, Upload, School
from typing import Any, List, Dict, Optional, Tuple
from controllers import response
from uuid import uuid4
import json, os, config


def _spp_parse_json(data:Optional[List[Spp]]) -> List[Dict[str,Any]]:
    if data:
        results:List[Dict[str,Any]] = []
        for value in data:
            results.append({
                'year': value.year,
                'month': value.month,
                'nominal_spp': value.nominal_spp,
                'nominal_kosma': value.nominal_kosma,
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
        nominal_spp:int = int(data.get('nominal_spp')) if data else None
        nominal_kosma:int = int(data.get('nominal_kosma')) if data else None
        if month and year and nominal_spp and nominal_kosma:
            exists = session.query(Spp).filter(Spp.year==year).filter(Spp.month==month).first()
            if exists:
                return response(status_code=401, message='data duplicate')
            spp = Spp(
                month=month,
                year=year,
                nominal_spp=nominal_spp,
                nominal_kosma=nominal_kosma
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


def _check_add_spp_handle(data:List[Dict[str,Any]]) -> Tuple[List[Dict[str,Any]],List[str]]:
    results:List[Dict[str,Any]] = []
    delete_spp:List[str] = []
    for value in data:
        spp_santri_uuid:str = value.get('spp_santri_uuid')
        santri_uuid:str = value.get('santri_uuid')
        spp_uuid:str = value.get('spp_uuid')
        delete:bool = value.get('delete')
        if spp_uuid == spp_santri_uuid and spp_santri_uuid and santri_uuid and spp_uuid:
            results.append({
                "santri_uuid":santri_uuid,
                "spp_uuid":spp_uuid,
            })
        elif delete:
            delete_spp.append(spp_santri_uuid)
    return results, delete_spp


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
            uniqe_result = _get_uniqe_data(filter_result[0])
            santri = session.query(Santri).filter(Santri.santri_uuid.in_(uniqe_result[0])).all()
            spp = session.query(Spp).filter(Spp.spp_uuid.in_(uniqe_result[1])).all()
            spp_santri = _add_spp_santri_handle(filter_result[0],santri,spp)
            if len(filter_result[1]) != 0:
                sppSantri = session.query(SppSantri).filter(SppSantri.spp_santri_uuid.in_(filter_result[1])).all()
                for value in sppSantri:
                    session.delete(value)
            session.add_all(spp_santri)
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


def _get_spp_payments(spp:Optional[List[Spp]],spp_santri:Optional[List[SppSantri]],santri_id:str,santri_yatim:bool) -> Tuple[List[Dict[str,Any]],int]:
    if(spp):
        result:List[Dict[str,Any]] = []
        total:int = 0
        for value in spp:
            santri_payment = _get_santri_payment(spp_santri,value.spp_id,santri_id)
            count = value.nominal_spp + value.nominal_kosma
            if santri_yatim:
                count = count - 100000
            if santri_payment == None:
                total = total + count
            result.append({
                "spp_uuid": value.spp_uuid,
                "year": value.year,
                "month": value.month,
                "total": count,
                "spp_santri_uuid": santri_payment if santri_payment else ''
            })
        return result, total
    else:
        return [], 0


def _spp_santri_handler(santri:Optional[List[Santri]],spp:Optional[List[Spp]],spp_santri:Optional[List[SppSantri]]) -> List[Dict[str,Any]]:
    if(santri):
        results:List[Dict[str,Any]] = []
        for value in santri:
            spp_result = _get_spp_payments(spp,spp_santri,value.santri_id,value.yatim)
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


def uploadImage():
    session = Session()
    try:
        if 'image' in request.files and 'uuid' in request.form:
            file = request.files.get('image')
            uuid = request.form.get('uuid')
            santri = session.query(Santri).filter(Santri.santri_uuid == uuid).first()
            if santri:
                extensi = file.filename.split('.')
                filename = f'{str(uuid4())}.{extensi[len(extensi)-1]}'
                upload = Upload(
                    santri_id=santri.santri_id,
                    filename=filename
                )
                session.add(upload)
                filepath = os.path.join(config.basedir, 'static', filename)
                file.save(filepath)
                session.commit()
                return response(status_code=200, message='upload success')
            else:
                return response(status_code=401, message='santri not found')
        else:
            return response(status_code=401, message='requires image and uuid')
    except Exception as e:
        return response(status_code=500, message=f'Internal server error: {str(e)}')
    finally:
        session.close()


def _this_santri_by_id(santri:Optional[List[Tuple[Santri,School]]],id:int) -> Optional[Tuple[Santri,School]]:
    if santri:
        for value in santri:
            current:Santri = value[0]
            if current.santri_id == id:
                return value
    return None

def _get_santri_uniqe(uploads:Optional[List[Upload]]) -> List[int]:
    if uploads:
        results = set()
        for value in uploads:
            results.add(value.santri_id)
        return list(results)
    else:
        return [0]


def _upload_parse_json(uploads:Optional[List[Upload]],santri_list:Optional[List[Tuple[Santri, School]]]) -> List[Dict[str,Any]]:
    if uploads:
        results:List[Dict[str, Any]] = []
        for value in uploads:
            result = _this_santri_by_id(santri_list,value.santri_id)
            santri:Santri = result[0]
            school:School = result[1]
            results.append({
                'filename':f"/static/{value.filename}",
                'datetime':value.datetime.strftime("%d-%m-%Y"),
                'name': santri.name,
                'nis': santri.nis,
                'address': santri.address,
                'parent': santri.parent,
                'gender': santri.gender,
                'school_name': school.name, 
            })
        return results
    else:
        return []


def getUploadImage():
    session = Session()
    try:
        image = session.query(Upload).all()
        santri_id = _get_santri_uniqe(image)
        santri = session.query(Santri, School).join(School, Santri.school_id == School.school_id).filter(Santri.santri_id.in_(santri_id)).all()
        results_parse = _upload_parse_json(image,santri)
        return response(status_code=200, message='get data success',data=results_parse)
    except Exception as e:
        return response(status_code=500, message=f'Internal server error: {str(e)}')
    finally:
        session.close()
