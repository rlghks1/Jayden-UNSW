from flask import Blueprint, request, Response, jsonify
from auth import MONGODB_API_KEY
import products.helper_funcs as hf

import requests, json, re

products = Blueprint('products', __name__)

@products.route('/products/query/all', methods=['POST', 'GET'])
def get_products():
    """
    Description:
    Returns a list of all products and attributes in JSON

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
            "collection": "Products",
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
        print(f"Something went wrong with the request. Status Code: {response.status_code}")
    
@products.route('/products/vote', methods=['POST'])
def product_vote():
    """
    Description:
    Changes the number of likes on a product

    API Parameters:
    sku (string): Product SKU
    vote (string): either +1 or -1

    Returns:
    Response: Response message and status code in JSON

   """
    content = request.json
    sku = content['sku']
    vote = content['vote']

    if vote == "-1":
        response = hf.downvote(sku)
        if response == 1:
            return Response('{"Reason":"Product successfully downvoted"}', status=200, mimetype='application/json')
        else:
            return Response('{"Reason":"Something went wrong downvoting"}', status=500, mimetype='application/json')
    elif vote == "+1":
        response = hf.upvote(sku)
        if response == 1:
            return Response('{"Reason":"Product successfully upvoted"}', status=200, mimetype='application/json')
        else:
            return Response('{"Reason":"Something went wrong upvoting"}', status=500, mimetype='application/json')

@products.route('/products/query', methods=['POST'])
def product_query():
    """
    Description:
    Returns a specific product and attributes in JSON

    API Parameters:
    sku (string): A zero-padded four digit number

    Returns:
    Response: JSON

    """
    content = request.json
    sku = content['sku']

    res = hf.query_product(sku)

    if res != -1:
        return Response(response=json.dumps(res), status=200, mimetype='application/json')
    else:
        data = {"Reason":"Something went wrong querying SKU. Product may not exist"}
        return Response(response=json.dumps(data), status=500, mimetype='application/json')
        # return Response("{'Reason':'Something went wrong querying SKU. Product may not exist'}", status=500, mimetype='application/json')

@products.route('/products/query/variable', methods=['POST'])
def product_query_variable():
    """
    Description:
    Returns a variable amount of products and attributes in JSON

    API Parameters:
    number (int): The number of products you want returned

    Returns:
    Response: JSON

    """
    content = request.json
    amount = int(content['amount'])

    # print(amount)

    response = hf.top_x_products(amount)

    if response != -1:
        return jsonify(response)
    else:
        return Response('{"Reason":"Something went wrong querying SKUs."}', status=500, mimetype='application/json')

@products.route('/products/update', methods=['POST'])
def product_update():
    """
    Description:
    Updates the attributes of a product

    API Parameters:
    content (dict): The changes of the attributes
        {
        "sku":"0001",               [REQUIRED]
        "price":"60",               [OPTIONAL]
        "name":"Giant Frogs",       [OPTIONAL]
        etc...
        }

    Look at test_api.py in /tests to see example

    Returns:
    Response: JSON

    """
    content = request.json

    if 'sku' not in content:
        return Response('{"Reason":"No SKU provided"}', status=400, mimetype='application/json')

    response = hf.update_product(content)

    if response != -1:
        return Response('{"Reason":"Successfully updated product"}', status=200, mimetype='application/json')
    else:
        return Response('{"Reason":"Something went wrong updating product. Check product fields"}', status=500, mimetype='application/json')

@products.route('/products/new', methods=['POST'])
def product_new():
    """
    Description:
    Inserts a new product

    API Parameters:
    content (dict): The changes of the attributes
        {
        "sku": "1111"                   [REQUIRED]
        "title":"test",                 [REQUIRED]
        "name":"test",                  [REQUIRED]
        "creator":"test",               [REQUIRED]
        "art_series":"test",            [REQUIRED]
        "price":"1000000",              [REQUIRED]
        "reservable":"true/false",      [REQUIRED]
        "type":"PHOTO/GIF",             [REQUIRED]
        "cid":"",                       [REQUIRED]
        "path":"Giant Frogs",           [REQUIRED]
        "tags":"[]",                    [REQUIRED]
        }

    The "likes", and "symbol" attributes will be automatically initialized.

    Look at test_api.py in /tests to see example

    Returns:
    Response: JSON

    """
    content = request.json
    required_fields = ['title', 'name', 'creator', 'art_series', 'price', 'reservable', 'type', 'cid', 'path', 'tags']
    for attribute in required_fields:
        if attribute not in content:
            return Response('{"Reason":"Product attribute missing"}', status=400, mimetype='application/json')

    content['likes'] = 0
    content['symbol'] = "SWAP.HIVE"

    response = hf.new_product(content)

    if response != -1:
        return Response('{"Reason":"Successfully created product"}', status=201, mimetype='application/json')
    else:
        return Response('{"Reason":"Something went wrong updating product. Check product fields"}', status=500, mimetype='application/json')

@products.route('/products/delete', methods=['POST'])
def product_delete():
    """
    Description:
    Deletes a product

    API Parameters:
    sku 

    Returns:
    Response: JSON

    """
    content = request.json
    sku = content['sku']

    response = hf.delete_product(sku)

    if response != -1:
        return Response('{"Reason":"Successfully deleted product"}', status=200, mimetype='application/json')
    else:
        return Response('{"Reason":"Something went wrong deleting product. Check product fields"}', status=500, mimetype='application/json')


@products.route('/products/recommended/product', methods=['POST'])
def product_recommended_product():
    """
    Description:
    Returns a list of recommended products based on similar products

    API Parameters:
    sku (string): The product SKU
    number (int): The number of products you want returned

    Returns:
    Response: JSON

    """
    content = request.json
    sku = content['sku']
    amount = int(content['amount'])

    # print(amount)

    response = hf.recommended_for_product(sku, amount)

    if response != -1:
        return jsonify(response)
    else:
        return Response('{"Reason":"Something went wrong finding recommendations."}', status=500, mimetype='application/json')