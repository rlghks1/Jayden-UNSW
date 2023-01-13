from flask import Blueprint, request, Response
from auth import MONGODB_API_KEY
import reservations.helper_funcs as hf

import requests
import json

reservations = Blueprint('reservations', __name__)


@reservations.route('/reservations/getReservations')
def getReservations():
    """
    Description:
    Returns a list of all reservations and attributes in JSON

    API Parameters:
    None

    Returns:
    Response: JSON

   """
    url = "https://data.mongodb-api.com/app/data-egqmk/endpoint/data/beta/action/find"

    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'api-key': f'{MONGODB_API_KEY}'
    }

    payload = json.dumps({
        "collection": "Reservations",
        "database": "COMP3900",
        "dataSource": "COMP3900",
    })

    try:
        response = requests.request("POST", url, headers=headers, data=payload)
        if response.status_code != 200:
            raise Exception(f"Status Code Error")
        else:
            response = json.loads(response.text)
            return response
    except:
        print(
            f"Something went wrong with the request. Status Code: {response.status_code}")


@reservations.route('/reservations/makeReservation', methods=['POST'])
def makeReservation():
    """
    Description:
    Creates a reservation

    API Parameters:
    email (string): Email address of user to make reservation for.
    sku (string): Product to make the reservation for.

    Returns:
    Response: JSON

   """

    content = request.json
    email = content['email']
    try:
        sku = content['sku']
    except:
        data = {'Reason': "Unsuccessful reservation"}
        return Response(response=json.dumps(data), status=500, mimetype='application/json')

    res = hf.makeReservation(email, sku)

    if res != -1:
        data = {'Reason': "Successful reservation"}
        data['res_id'] = res
        return Response(response=json.dumps(data), status=200, mimetype='application/json')
    else:
        data = {'Reason': "Unsuccessful reservation"}
        return Response(response=json.dumps(data), status=500, mimetype='application/json')


@reservations.route('/reservations/checkReservation', methods=['POST'])
def checkReservation():
    """
    Description:
    Returns a specific reservation by the reservation id.

    API Parameters:
    id (string): Reservation ID.

    Returns:
    Response: JSON of reservation details if valid else returns False (bool)

   """
    content = request.json
    reservationid = content['reservationid']

    res = hf.getReservation_id(reservationid)

    if res != -1:
        return Response(response=json.dumps(res), status=200, mimetype='application/json')
    else:
        data = {'Reason': "Reservation expired or invalid ReservationID provided."}
        return Response(response=json.dumps(data), status=400, mimetype='application/json')


@reservations.route('/reservations/updateReservations', methods=['POST'])
def updateReservations():
    """
    Description:
    Updates the existing reservations to check if they are valid

    API Parameters:
    None

    Returns:
    None

   """
    hf.updateReservations()
    return Response(status=200, mimetype='application/json')

@reservations.route('/reservations/removeReservation', methods=['POST'])
def removeReservation():
    """
    Description:
    Removes an existing reservations by reservationid

    API Parameters:
    reservationid(string)
    sku(string)

    Returns:
    None

   """
    content = request.json
    print(content)
    reservationid = content['reservationid']
    sku = content['sku']
    res = hf.removeReservation(reservationid, sku)
    

    if res != -1:
        return Response(response=json.dumps(res), status=200, mimetype='application/json')
    else:
        data = {'Reason': "Failed to delete reservation. Reservation not found/ReservationID provided."}
        return Response(response=json.dumps(data), status=400, mimetype='application/json')

@reservations.route('/reservations/removeUserReservation', methods=['POST'])
def removeUserReservation():
    """
    Description:
    Removes an existing user reservation by reservationid and email

    API Parameters:
    reservationid(string), email(string)

    Returns:
    None

   """
    content = request.json
    email = content['email']
    reservationid = content['reservationid']
    
    res = hf.removeUserReservation(email, reservationid)
    
    if res != -1:
        return Response(response=json.dumps(res), status=200, mimetype='application/json')
    else:
        data = {'Reason': "Failed to delete reservation. Reservation not found/ReservationID provided."}
        return Response(response=json.dumps(data), status=400, mimetype='application/json')
