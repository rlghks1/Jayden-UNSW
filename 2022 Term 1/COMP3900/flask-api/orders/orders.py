from flask import Blueprint, request, Response
from auth import MONGODB_API_KEY
import orders.helper_funcs as hf

import requests
import json

orders = Blueprint('orders', __name__)


@orders.route('/orders/getHistory', methods=['POST'])
def getHistory():
    """
    Description:
    Returns a list of all orders and attributes in JSON

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
        "collection": "OrderHistory",
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


@orders.route('/orders/getOrder', methods=['POST'])
def getOrder():
    """
    Description:
    Returns a specific order and attributes in JSON

    API Parameters:
    None

    Returns:
    Response: JSON

   """
    content = request.json
    orderNo = content['orderNo']

    res = hf.getOrder(orderNo)

    if res != -1:
        return Response(response=json.dumps(res), status=200, mimetype='application/json')
    else:
        data = {
            'Reason': "Something went wrong querying Order number. Order may not exist"}
        return Response(response=json.dumps(data), status=500, mimetype='application/json')


@orders.route('/orders/newPurchase', methods=['POST'])
def newPurchase():
    """
    Description:
    Create a new order

    API Parameters:
    content (dict): The changes of the attributes
        {
        "products": "[0001,0002,0003]"         [REQUIRED]
        "buyer":"comp3900t1@gmail.com",        [REQUIRED]
        "cost":"60",                           [REQUIRED]
        "date":"DD/MM/YYYY",                   [REQUIRED]
        "quantity":"1",                        [REQUIRED]
        }

    The "orderno" attribute will be automatically initialized.

    Look at test_api.py in /tests to see example

    Returns:
    Response: JSON

   """
    data = request.json
    res = hf.makePurchase(data)

    if res != -1:
        return Response(response=json.dumps(res), status=200, mimetype='application/json')
    else:
        data = {
            'Reason': "Something went wrong querying Order number. Order may not exist"}
        return Response(response=json.dumps(data), status=500, mimetype='application/json')
