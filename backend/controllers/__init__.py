from typing import Any, Dict, List, Union, Optional 
from flask import jsonify

def response(*, status_code:int, message:str, data:Optional[Union[Dict[str,Any],List[Dict[str,Any]]]]=None) :
    result:Dict[str,Any] = {
        'status': status_code,
        'message': message,
    }
    options:Dict[str,Any] = {'ContentType':'application/json'}
    if data:
        result['data'] = data
    return jsonify(result), status_code, options