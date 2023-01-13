from flask import request
from auth import MONGODB_API_KEY
from auth import SECRET_KEY
import products.helper_funcs as productfuncs
import users.helper_funcs as usersfuncs
from itsdangerous import TimedJSONWebSignatureSerializer

import requests
import json

headers = {
    'Content-Type': 'application/json',
    'Access-Control-Request-Headers': '*',
    'api-key': f'{MONGODB_API_KEY}'
}

search_url = "https://data.mongodb-api.com/app/data-egqmk/endpoint/data/beta/action/findOne"
update_url = "https://data.mongodb-api.com/app/data-egqmk/endpoint/data/beta/action/updateOne"
search_multi_url = "https://data.mongodb-api.com/app/data-egqmk/endpoint/data/beta/action/find"
insert_url = "https://data.mongodb-api.com/app/data-egqmk/endpoint/data/beta/action/insertOne"
delete_url = "https://data.mongodb-api.com/app/data-egqmk/endpoint/data/beta/action/deleteOne"


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


def makeReservation(email, sku):
    """
    Description:
    Creates a reservation

    API Parameters:
    email (string): Email address of user to make reservation for.
    sku (string): Product to make the reservation for.

    Returns:
    Response: JSON

   """
    prod = productfuncs.query_product(sku)
    if prod['document']['reservable'] != True:
        print("Product not reservable")
        return -1

    s = TimedJSONWebSignatureSerializer(SECRET_KEY, expires_in=86400)
    reservationToken = str(s.dumps({"email": email, "sku": sku}))[2:-1]
    print("Reservation Token generated")

    payload = json.dumps({
        "collection": "Reservations",
        "database": "COMP3900",
        "dataSource": "COMP3900",
        "sort": {
            "reservationid": -1
        },
        "limit": 1
    })

    response = requests.request(
        "POST", search_multi_url, headers=headers, data=payload)

    print("Multisearch", response.text)

    _temp = json.loads(response.text)
    
    if _temp['documents'] == [] :
        reservationid = "0001"
    else :        
        reservationid = str(
            int(_temp['documents'][0]['reservationid'])+1).zfill(4)

    payload = json.dumps({
        "collection": "Reservations",
        "database": "COMP3900",
        "dataSource": "COMP3900",
        "document": {
            "reservationid": f"{reservationid}",
            "reservationtoken": f"{reservationToken}",
            "email": f"{email}",
            "sku": f"{sku}"
        }
    })

    try:
        response = requests.request(
            "POST", insert_url, headers=headers, data=payload)
        print(payload, response.status_code)

        if response.status_code == 201:
            setReservableFalse(sku)
            addUserReservation(email, reservationid)
            response = json.loads(response.text)
            return response
        else:
            removeReservation(reservationid)
            setReservableTrue(sku)
            raise Exception(f"Status Code Error")
    except:
        print(
            f"Something went wrong with the request. Status Code: {response.status_code}")
        return -1



def getReservation_id(id):
    """
    Description:
    Returns a specific reservation by the reservation id.

    API Parameters:
    id (string): Reservation ID.

    Returns:
    Response: JSON of reservation details as well as if reservation is valid (bool)
    -1: if invalid

   """
    try:
        payload = json.dumps({
            "collection": "Reservations",
            "database": "COMP3900",
            "dataSource": "COMP3900",
            "filter": {
                "reservationid": f"{id}"
            }
        })

        response = requests.request(
            "POST", insert_url, headers=headers, data=payload)

        if response.status_code != 200:
            raise Exception(f"Status Code Error")
        else:
            response = json.loads(response.text)
            if checkReservationToken(response['document']['reservationtoken']) == True:
                return response
            else:
                return -1
    except:
        print(
            f"Something went wrong with the request. Status Code: {response.status_code}")
        return -1


def checkReservationToken(token):
    token = bytes(token, 'utf-8')
    s = TimedJSONWebSignatureSerializer(SECRET_KEY)
    print(token)
    try:
        t = s.loads(token)
        print(t)
    except:
        print("Reservation token expired")
        return False
    else:
        print("Reservation token not expired")
        return True


def updateReservations():
    reservations = getReservations()
    for reservation in reservations['documents']:
        #print(reservations)
        if checkReservationToken(reservation['reservationtoken']) == False:
            # update so the product is reservable again
            payload = json.dumps({
                "collection": "Products",
                "database": "COMP3900",
                "dataSource": "COMP3900",
                "filter": {
                    "sku":f"{reservation['sku']}"
                },
                "update": {
                    "$set": {
                        "reservable": True
                    }
                }
            })
        
            response = requests.request(
                "POST", update_url, headers=headers, data=payload)
            
            removeUserReservation(reservation['email'], reservation['reservationid'])
            removeReservation(reservation['reservationid'], reservation['sku'])


def setReservableFalse(sku):
    payload = json.dumps({
        "collection": "Products",
        "database": "COMP3900",
        "dataSource": "COMP3900",
        "filter": {
                    "sku": f"{sku}"
        },
        "update": {
            "$set": {
                "reservable": False
            }
        }
    })

    response = requests.request(
        "POST", update_url, headers=headers, data=payload)

def setReservableTrue(sku):
    payload = json.dumps({
        "collection": "Products",
        "database": "COMP3900",
        "dataSource": "COMP3900",
        "filter": {
                    "sku": f"{sku}"
        },
        "update": {
            "$set": {
                "reservable": True
            }
        }
    })

    response = requests.request(
        "POST", update_url, headers=headers, data=payload)

def addUserReservation(email, reservationid):
    # Get user order history
    payload = json.dumps({
        "collection": "Users",
        "database": "COMP3900",
        "dataSource": "COMP3900",
        "filter": {
            "email": f"{email}"
        }
    })

    response = requests.request(
        "POST", search_url, headers=headers, data=payload)

    user = json.loads(response.text)

    user_reservations = list(user['document']['reservations'])

    user_reservations.append(reservationid)

    payload = json.dumps({
        "collection": "Users",
        "database": "COMP3900",
        "dataSource": "COMP3900",
        "filter": {
            "email": f"{email}",
        },
        "update": {
            "$set": {
                "reservations": user_reservations
            }
        }

    })

    response = requests.request(
        "POST", update_url, headers=headers, data=payload)

    print("User Reservations updated.")


def removeUserReservation(email, reservationid):
    # Get user order history

    user = usersfuncs.find_user(email)
    user_reservations = list(user['document']['reservations'])
    print(user_reservations)
    if reservationid in user_reservations :
        user_reservations.remove(reservationid)

    payload = json.dumps({
        "collection": "Users",
        "database": "COMP3900",
        "dataSource": "COMP3900",
        "filter": {
            "email": f"{email}",
        },
        "update": {
            "$set": {
                "reservations": user_reservations
            }
        }
    })

    response = requests.request(
        "POST", update_url, headers=headers, data=payload)

    print("User Reservations updated.")

def removeReservation(reservation, sku):
    payload = json.dumps({
            "collection": "Reservations",
            "database": "COMP3900",
            "dataSource": "COMP3900",
            "filter": {
                "reservationid": f"{reservation}"
            }
        })

    response = requests.request(
        "POST", delete_url, headers=headers, data=payload)
    
    setReservableTrue(sku)