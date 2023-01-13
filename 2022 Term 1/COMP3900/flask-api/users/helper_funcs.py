from itsdangerous import TimedJSONWebSignatureSerializer
from auth import MONGODB_API_KEY, SECRET_KEY, MAILGUN_API_KEY
from email_validator import validate_email, EmailNotValidError
import os
import sys
import json
import requests
import hashlib
sys.path.insert(1, os.path.join(sys.path[0], '..'))

headers = {
    'Content-Type': 'application/json',
    'Access-Control-Request-Headers': '*',
    'api-key': f'{MONGODB_API_KEY}'
}

search_url = "https://data.mongodb-api.com/app/data-egqmk/endpoint/data/beta/action/findOne"
update_url = "https://data.mongodb-api.com/app/data-egqmk/endpoint/data/beta/action/updateOne"
insert_url = "https://data.mongodb-api.com/app/data-egqmk/endpoint/data/beta/action/insertOne"


def valid_email(email):
    """
    Description:
    Validates an email address based on format and domain

    API Parameters:
    email (string): Email address

    Returns:
    bool: True or False

   """
    try:
        valid = validate_email(email)
    except EmailNotValidError as e:
        print(str(e))
        return False

    print("Email is valid")
    return True


def find_user(email):
    """
    Description:
    Checks if a user exists in the database.

    API Parameters:
    email (string): The user's email

    Returns:
    dict: The user and user attributes if the user is found
    int: -1 if the user is not found

   """

    payload = json.dumps({
        "collection": "Users",
        "database": "COMP3900",
        "dataSource": "COMP3900",
        "filter": {
            "username": f"{email}",
        }
    })

    response = requests.request(
        "POST", search_url, headers=headers, data=payload)
    response = json.loads(response.text)
    print(response)

    if response['document'] == None:
        print("User not found")
        return -1
    else:
        return response


def register_user(data):
    """
    Description:
    Inserts a user into the database

    API Parameters:
    data (dict): The user's email, password, first_name, last_name, admin_status

    Returns:
    dict: The user and user attributes if the user is successfully registered
    int: -1 if the user already exists or email taken

   """
    # First check if the user already exists
    if find_user(data['email']) != -1:
        print("User already exists")
        return -1

    # Hashing the user password
    d = hashlib.sha256(data['password'].encode())
    d_hash = d.hexdigest()

    payload = json.dumps({
        "collection": "Users",
        "database": "COMP3900",
        "dataSource": "COMP3900",
        "document": {
                    "username": f"{data['email']}",
                    "f_name": f"{data['f_name']}",
                    "l_name": f"{data['l_name']}",
                    "email": f"{data['email']}",
                    "loggedIn": False,
                    "admin": False,
                    "reservations": [],
                    "key": f"{d_hash}",
                    "orderHistory": [],
                    "recommendations": []
        }
    })

    # Request to create the user
    try:
        response = requests.request(
            "POST", insert_url, headers=headers, data=payload)
        if response.status_code != 201:
            raise Exception("Status Code Error")
        else:
            response = json.loads(response.text)
            print("User successfully created")
            return response
    except:
        print(
            f"Something went wrong with the request. Status Code: {response.status_code}")
        return -1


def update_user_password(data):
    """
    Description:
    Updates a user details in the databse

    API Parameters:
    data (dict): The user's email, password, first_name, last_name, admin_status

    Returns:
    bool: True if updated successfully

   """

    # Hashing the user password
    d = hashlib.sha256(data['new_password'].encode())
    d_hash = d.hexdigest()

    payload = json.dumps({
        "collection": "Users",
        "database": "COMP3900",
        "dataSource": "COMP3900",
        "filter": {
                    "email": f"{data['email']}"
        },
        "update": {
            "$set": {
                "key": f"{d_hash}"
            }
        }
    })

    # Request to update the user
    try:
        response = requests.request(
            "POST", update_url, headers=headers, data=payload)
        if response.status_code != 200:
            raise Exception("Status Code Error")
        else:
            response = json.loads(response.text)
            print("User successfully updated")
            return True
    except:
        print(
            f"Something went wrong with the request. Status Code: {response.status_code}")
        return False


def login_user(email, password):
    """
    Description:
    Logins a user
    API Parameters:
    email (string): The user's email
    password (string): The user's password
    Returns:
    bool: True if the user successfully logs in. False if user does not exist or incorrect password
   """

    user = find_user(email)

    if user == -1:
        return False

    # Hashing the user password
    d = hashlib.sha256(password.encode())
    d_hash = d.hexdigest()

    if (user['document']['key'] == d_hash):
        print("User successfully logged in")
        print("ummm")
        print("Email is valid")
        return True
    else:
        print("Invalid password provided")
        return False


def login_admin(email, password):
    """
    Description:
    Logins a user

    API Parameters:
    email (string): The user's email
    password (string): The user's password

    Returns:
    bool: True if the user successfully logs in. False if user does not exist or incorrect password

   """

    user = find_user(email)

    if user == -1:
        return False

    # Hashing the user password
    d = hashlib.sha256(password.encode())
    d_hash = d.hexdigest()

    if (user['document']['key'] == d_hash) and user['document']['admin'] == True:
        print("Admin successfully logged in")
        return True
    else:
        print("Not admin")
        return False


def send_password_reset(user, link):
    print("Email Posting")
    response = requests.post(
        "https://api.mailgun.net/v3/sandbox7ec13b9f26cc4bde9bf9e2c9766f79ba.mailgun.org/messages",
        auth=("api", f"{MAILGUN_API_KEY}"),
        data={"from": "Guilty Dawgs <postmaster@guiltydawgs.com>",
                      "to": f"{user['f_name']} {user['l_name']} <{user['email']}>",
                      "subject": f"GuiltyNFT Password Reset Request for {user['f_name']} {user['l_name']}",
              "text": f"Reset your password here: {link}"})
    print(response.text)


def generate_auth_token(email):
    s = TimedJSONWebSignatureSerializer(SECRET_KEY, expires_in=3600)
    token = s.dumps({"email": f"{email}"})
    print("Token generated")
    return token


def auth_token_valid(token):
    token = bytes(token, 'utf-8')
    s = TimedJSONWebSignatureSerializer(SECRET_KEY)
    print(token)
    try:
        t = s.loads(token)
        print(t)
    except:
        print("Token expired")
        return False
    else:
        print("Token not expired")
        return True
