import requests
from itsdangerous import TimedJSONWebSignatureSerializer
from flask import jsonify, request
import os
import sys
sys.path.insert(1, os.path.join(sys.path[0], '..'))
import requests, json, re
from auth import MONGODB_API_KEY
import products.helper_funcs as prodhf

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

# Test Users


def test_users_register_user():

    res = requests.post('http://localhost:5000/users/register', json={
                        "email": "comp3900t2@gmail.com", "f_name": "guilty", "l_name": "dawgs", "password": "password"})
    print(res.text)


def test_users_login_user():

    res = requests.post('http://localhost:5000/users/login',
                        json={"email": "admin@gmail.com", "password": "password"})
    print(res.text)


def test_users_register_user_already_exists():

    res = requests.post('http://localhost:5000/users/login',
                        json={"email": "admin@guiltydawgs.com", "password": "password"})
    print(res.text)


def test_user_request_pw_reset():
    res = requests.post('http://localhost:5000/users/request_password_reset',
                        json={"email": "comp3900t1@gmail.com"})
    print(res.text)


def test_user_pw_reset(token):
    res = requests.post('http://localhost:5000/users/reset_password', json={
                        "email": "comp3900t1@gmail.com", "new_password": "password1", "token": f"{token}"})
    print(res.text)


# Test Products

def test_product_query():
    res = requests.post(
        'http://localhost:5000/products/query', json={"sku": "0001"})
    print(res.text)


def test_downvote():
    res = requests.post('http://localhost:5000/products/vote',
                        json={"sku": "0001", "vote": "-1"})


def test_upvote():
    res = requests.post('http://localhost:5000/products/vote',
                        json={"sku": "0001", "vote": "+1"})


def test_query_variable():
    res = requests.post(
        'http://localhost:5000/products/query/variable', json={"amount": "9"})
    print(res.text)


def test_update_product():
    res = requests.post('http://localhost:5000/products/update',
                        json={"sku": "0001", "price": "60", "name": "Giant Frogs"})
    print(res.text)


def test_create_product():
    res = requests.post('http://localhost:5000/products/new', json={"sku": "6666", "title": "test", "name": "test", "creator": "test",
                        "art_series": "test", "price": "60", "reservable": "true", "type": "PHOTO", "cid": "test", "path": "/test", "tags": "['Liquid']"})
    print(res.text)


def test_delete_product():
    res = requests.post(
        'http://localhost:5000/products/delete', json={"sku": "2993"})
    print(res.text)


def test_send_email():
    return requests.post(
        "https://api.mailgun.net/v3/sandbox7ec13b9f26cc4bde9bf9e2c9766f79ba.mailgun.org/messages",
        auth=("api", "a748996b2ba07fbd253e7c8b00b046d0-0677517f-9fb6bbf5"),
        data={"from": "Guilty Dawgs <postmaster@guiltydawgs.com>",
                      "to": "Beff Jezos <beffjezos9447@gmail.com>",
                      "subject": "Hello Beff Jezos",
              "text": "Congratulations Beff Jezos, you just sent an email with Mailgun!  You are truly awesome!"})

# Test Order HistoryDone


def test_orderHistory():
    res = requests.post('http://localhost:5000/orders/getHistory', json={})
    print(res.text)


def test_makePurchase():
    res = requests.post('http://localhost:5000/orders/newPurchase', json={
                        "products": "[0001]", "buyer": "admin@gmail.com", "cost": "45", "date": "10/04/2022", "quantity": "1"})

# Test Reservation


def test():
    res = requests.post('http://localhost:5000/reservations/tests',
                        json={"email": "comp3900t1@gmail.com", "sku": "0001"})
    print(res.text)


def test_makeReservation():
    res = requests.post('http://localhost:5000/reservations/makeReservation',
                        json={"email": "comp3900t1@gmail.com", "sku": "0001"})
    print(res.text)



if __name__ == '__main__':
    # test_users_register_user()
    # test_users_login_user()
    # test_upvote()
    # test_product_query()
    # test_send_email()
    # tok = generate_auth_token("beffjezos9447@gmail.com")
    # session = {}
    # session[f'{tok}'] = tok
    # verify_time_auth_token(session[f'{tok}'])
    # test_user_request_pw_reset()
    # test_user_pw_reset("eyJhbGciOiJIUzUxMiIsImlhdCI6MTY0ODA0MzU5NSwiZXhwIjoxNjQ4MDQ3MTk1fQ.eyJlbWFpbCI6ImNvbXAzOTAwdDFAZ21haWwuY29tIn0.BtHQJUvQrHAJ3Xnd8CfV1OMsfFJaPz7LW1Is-2HQ4IxLt8CugrxswqAGKrDCZLtl8W2ic4lHERISrQmJwLtTBg")
    # tok = generate_auth_token("comp3900t1@gmail.com")
    # print(auth_token_valid(str(tok)[2:-1]))
    # test_query_variable()
    # test_create_product()
    # test_delete_product()
    # test_orderHistory()
    # test_makePurchase()
    # test()
    # test_makeReservation()
    prodhf.update_recommended_for_user("123@hotmail.com")