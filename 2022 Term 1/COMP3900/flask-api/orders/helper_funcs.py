from flask import request
from auth import MONGODB_API_KEY
import reservations.helper_funcs as reservation_funcs
import products.helper_funcs as products_funcs

import requests
import json
import re

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


def getOrder(orderNo):
    """
    Description:
    Returns a specific product and attributes in JSON

    Returns:
    Response: JSON
    int: -1 if error with SKU

   """

    payload = json.dumps({
        "collection": "OrderHistory",
        "database": "COMP3900",
        "dataSource": "COMP3900",
        "filter": {
            "orderno": f"{orderNo}"
        }
    })
    try:
        response = requests.request(
            "POST", search_url, headers=headers, data=payload)

        if response.status_code != 200:
            print("Error retrieving Order")
            return -1
        else:
            print("Successfully queried Order")
            response = json.loads(response.text)
            return response
    except:
        print(
            f"Something went wrong with the request. Status Code: {response.status_code}")
        return -1


def makePurchase(data):
    """
    Description:
    Make a purchase

    Returns:
    Response: JSON
    int: -1 if error

   """
    payload = json.dumps({
        "collection": "OrderHistory",
        "database": "COMP3900",
        "dataSource": "COMP3900",
        "sort": {
            "orderno": -1
        },
        "limit": 1
    })

    response = requests.request(
        "POST", search_multi_url, headers=headers, data=payload)

    _temp = json.loads(response.text)
    print(_temp)
    data['orderno'] = str(int(_temp['documents'][0]['orderno'])+1).zfill(4)

    payload = json.dumps({
        "collection": "OrderHistory",
        "database": "COMP3900",
        "dataSource": "COMP3900",
        "document": data

    })

    response = requests.request(
        "POST", insert_url, headers=headers, data=payload)

    if response.status_code == 201:
        response = json.loads(response.text)
        updateUserOrder(data['orderno'], data['buyer'])
        updateProductQuantity(data['products'])
        products_funcs.update_recommended_for_user()
        return response
    else:
        print(f"Error making purchase. Status Code: {response.status_code}")
        return -1


def updateUserOrder(orderNumber, email):

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

    user_orders = list(user['document']['orderHistory'])

    user_orders.append(orderNumber)

    payload = json.dumps({
        "collection": "Users",
        "database": "COMP3900",
        "dataSource": "COMP3900",
        "filter": {
            "email": f"{email}",
        },
        "update": {
            "$set": {
                "orderHistory": user_orders
            }
        }

    })

    response = requests.request(
        "POST", update_url, headers=headers, data=payload)

    print("User Order History updated.")

def updateProductQuantity(arr):

    # new = list(arr[1:-1].split(','))

    for product in arr:
        print(product)
        payload = json.dumps({
            "collection": "Products",
            "database": "COMP3900",
            "dataSource": "COMP3900",
            "filter": {
                "sku": f"{product}",
            },
            "update": {
                "$set": {
                    "quantity": 0
                }
            }
        })

        response = requests.request(
            "POST", update_url, headers=headers, data=payload)

        print("Product Quantity updated.")