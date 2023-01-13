from flask import request
from auth import MONGODB_API_KEY

import requests, json, re

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



def query_product(sku):
    """
    Description:
    Returns a specific product and attributes in JSON

    Returns:
    Response: JSON
    int: -1 if error with SKU

   """

    sku_check = re.fullmatch('^\d{4}', sku)

    if sku_check:
        payload = json.dumps({
            "collection": "Products",
            "database": "COMP3900",
            "dataSource": "COMP3900",
            "filter": {
                "sku": f"{sku}"
            }
        })
        try:
            response = requests.request("POST", search_url, headers=headers, data=payload)

            if response.status_code != 200:
                print("Error retrieving SKU")
                return -1
            else:
                print("Successfully queried SKU")
                response = json.loads(response.text)                
                return response
        except:
            print(f"Something went wrong with the request. Status Code: {response.status_code}")
            return -1
    else:
        return -1

def downvote(sku):
    """
        Description:
        Downvotes the product

        Returns:
        int: 0 for false/unsuccessful
        int: 1 for true/successful

    """

    product = query_product(sku)

    if product == -1:
        return 0
    else:
        new_value = str(int(product['document']['likes'])-1)
        try:
            payload = json.dumps({
                "collection": "Products",
                "database": "COMP3900",
                "dataSource": "COMP3900",
                "filter": {
                    "sku": f"{sku}"
                },
                "update": {
                    "$set": {
                        "likes": f"{new_value}"
                    }
                }
            })

            response = requests.request("POST", update_url, headers=headers, data=payload)

            if response.status_code != 200:
                print("Error downvoting SKU")
                return 0
            else:
                print("Successfully downvoted SKU")
                return 1
        except:
            print(f"Something went wrong with the request. Status Code: {response.status_code}")
            return 0


def upvote(sku):
    """
        Description:
        Upvotes a product

        Returns:
        int: 0 for false/unsuccessful
        int: 1 for true/successful
    """
    product = query_product(sku)

    if product == -1:
        return 0
    else:
        new_value = str(int(product['document']['likes'])+1)
        try:
            payload = json.dumps({
                "collection": "Products",
                "database": "COMP3900",
                "dataSource": "COMP3900",
                "filter": {
                    "sku": f"{sku}"
                },
                "update": {
                    "$set": {
                        "likes": f"{new_value}"
                    }
                }
            })

            response = requests.request("POST", update_url, headers=headers, data=payload)

            if response.status_code != 200:
                print("Error upvoting SKU")
                return 0
            else:
                print("Successfully upvoted SKU")
                return 1
        except:
            print(f"Something went wrong with the request. Status Code: {response.status_code}")
            return 0

def top_x_products(amount):
    """
        Description:
        Searches for the top X amount of products 

        Returns:
        Response: JSON if successful
        int: -1 for unsuccessful
    """
    try:
        payload = json.dumps({
            "collection": "Products",
            "database": "COMP3900",
            "dataSource": "COMP3900",
            "sort": {
                "likes": -1
            },
            "limit": amount
        })

        response = requests.request("POST", search_multi_url, headers=headers, data=payload)

        if response.status_code != 200:
            print(f"Error finding products. Status Code: {response.status_code}")
            print(response.text)
            return -1
        else:
            response = json.loads(response.text)
            return response
    except:
        print(f"Something went wrong with the request. Status Code: {response.status_code}")
        return -1

def update_product(data):
    try:
        payload = json.dumps({
                "collection": "Products",
                "database": "COMP3900",
                "dataSource": "COMP3900",
                "filter": {
                    "sku": f"{data['sku']}"
                },
                "update": {
                    "$set": data
                }
            })

        response = requests.request("POST", update_url, headers=headers, data=payload)

        if response.status_code != 200:
            print(f"Error updating products. Status Code: {response.status_code}")
            print(response.text)
            return -1
        else:
            return True
    except:
        print(f"Something went wrong with the request. Status Code: {response.status_code}")
        return -1

def new_product(data):
    try:
        payload = json.dumps({
                "collection": "Products",
                "database": "COMP3900",
                "dataSource": "COMP3900",
                "document": data
            })

        response = requests.request("POST", insert_url, headers=headers, data=payload)

        if response.status_code != 201:
            print(f"Error creating product. Status Code: {response.status_code}")
            print(response.text)
            return -1
        else:
            return True
    except:
        print(f"Something went wrong with the request. Status Code: {response.status_code}")
        return -1

def delete_product(sku):
    try:
        payload = json.dumps({
                "collection": "Products",
                "database": "COMP3900",
                "dataSource": "COMP3900",
                "filter": {
                    "sku": f"{sku}"
                }
            })

        response = requests.request("POST", delete_url, headers=headers, data=payload)

        if response.status_code != 200:
            print(f"Error deleting product. Status Code: {response.status_code}")
            print(response.text)
            return -1
        else:
            return True
    except:
        print(f"Something went wrong with the request. Status Code: {response.status_code}")
        return -1

def update_recommended_for_user(email):
    """
        Description:
        Updates recommendations based on user order history. If a user does not have any order history, returns default site recommendations
        - It grabs the users order history and gets all the tags associated with all the products ever purchased.
        - Then it gets the most popular items (sorted by likes) for each tag and updates the user's recommended list on the DB
    """

    final_list = []

    # Get past orders by user
    payload = json.dumps({
            "collection": "OrderHistory",
            "database": "COMP3900",
            "dataSource": "COMP3900",
            "filter": {
                "buyer": f"{email}"
            }
        })

    response = requests.request("POST", search_multi_url, headers=headers, data=payload)
    arr = get_products()
    user_res = json.loads(response.text)
    # print(user_res)
    user_product_history = []
    for prods in user_res['documents']:
        user_product_history += prods['products']
    # print(user_product_history)
    if len(user_product_history) == 0:
        final_list = top_x_products(10)
        payload = json.dumps({
            "collection": "Users",
            "database": "COMP3900",
            "dataSource": "COMP3900",
            "filter": {
                "email": f"{email}"
            },
            "update": {
                "$set": {
                    "recommendations": final_list['documents']
                }
            }
        })
        response = requests.request("POST", update_url, headers=headers, data=payload)
        return

    get_tags = []
    for skus in user_product_history:
        for prod in arr['documents']:
            if prod['sku'] == skus:
                get_tags = list(prod['tags'][1:-1].split(', '))

    new = set(get_tags)

    for tag in new:
        current_top = {'likes': 0}
        for prod in arr['documents']:
            if tag in prod['tags']:
                if prod['likes'] >= current_top['likes']:
                    current_top = prod
        if current_top not in final_list:
            final_list.append(current_top)

    # print(final_list)

    payload = json.dumps({
            "collection": "Users",
            "database": "COMP3900",
            "dataSource": "COMP3900",
            "filter": {
                "email": f"{email}"
            },
            "update": {
                "$set": {
                    "recommendations": final_list
                }
            }
        })

    response = requests.request("POST", update_url, headers=headers, data=payload)



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