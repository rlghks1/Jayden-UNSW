import users.helper_funcs as hf
from flask import Blueprint, request, Response, session
from base64 import b64encode, b64decode
from auth import MONGODB_API_KEY, SECRET_KEY
import os
import sys
import hashlib
import json
import requests
sys.path.insert(1, os.path.join(sys.path[0], '..'))

users = Blueprint('users', __name__)

reset_tokens = {}


@users.route('/users/register', methods=['POST'])
def register_user():
    """
    Description:
    Registers a user.

    API Parameters:
    email (string): User supplied email
    password (string) User supplied password
    first (string) User supplied first name
    last (string) User supplied last name

    Returns:
    Response: Response message and status code in JSON

   """

    content = request.json
    email = content['email']
    password = content['password']
    f_name = content['f_name']
    l_name = content['l_name']

    if hf.valid_email(email) == False:
        data = {'Reason': "INVALID EMAIL"}
        return Response(response=json.dumps(data), status=400, mimetype='application/json')

    if hf.find_user(email) == -1:
        response = hf.register_user(content)
        if response:
            data = {'Reason': "USER SUCCESSFULLY REGISTERED"}
            return Response(response=json.dumps(data), status=200, mimetype='application/json')
        else:
            data = {'Reason': "USER REGISTER FAILED"}
            return Response(response=json.dumps(data), status=500, mimetype='application/json')
    else:
        data = {'Reason': "USER ALREADY EXISTS"}
        return Response(response=json.dumps(data), status=400, mimetype='application/json')


@users.route('/users/login', methods=['POST'])
def login_user():
    """
    Description:
    Logins a user and adds them to the session
    API Parameters:
    email (string): User supplied email
    password (string) User supplied password
    Returns:
    Response: Response message and status code in JSON
   """

    content = request.json

    email = content['email']
    password = content['password']

    if hf.valid_email(email) == False:
        data = {'Reason': "INVALID EMAIL"}
        return Response(response=json.dumps(data), status=400, mimetype='application/json')

    if hf.login_user(email, password) == True:
        session[f'{email}'] = email
        data = {'Reason': "VALID LOGIN"}
        user_data = hf.find_user(email)
        del user_data['document']['key']
        data['user_data'] = user_data
        return Response(response=json.dumps(data), status=200, mimetype='application/json')
    else:
        data = {'Reason': "INVALID LOGIN"}
        return Response(response=json.dumps(data), status=401, mimetype='application/json')

@users.route('/users/get_data', methods=['POST'])
def get_user():
    """
    Description:
    Gets a user's data
    API Parameters:
    email (string): User supplied email
    Returns:
    Response: Response message and status code in JSON
   """

    content = request.json

    email = content['email']

    if hf.valid_email(email) == False:
        data = {'Reason': "INVALID EMAIL"}
        return Response(response=json.dumps(data), status=400, mimetype='application/json')

    data = {'Reason': "VALID EMAIL"}
    user_data = hf.find_user(email)
    del user_data['document']['key']
    data['user_data'] = user_data
    return Response(response=json.dumps(data), status=200, mimetype='application/json')



@users.route('/users/isAuthenticated', methods=['POST'])
def isAuthenticated():
    """
    Description:
    Checks if a user is authenticated

    API Parameters:
    email (string): User supplied email

    Returns:
    Response: Response message and status code in JSON

   """
    content = request.json
    email = content['email']

    if email in session:
        return Response('{"Reason":"User is authenticated"}', status=200, mimetype='application/json')
    else:
        return Response('{"Reason":"User not authenticated"}', status=401, mimetype='application/json')


@users.route('/users/request_password_reset', methods=['POST'])
def request_password_reset():
    """
    Description:
    Sends a password reset link to email address.

    API Parameters:
    email (string): User supplied email

    Returns:
    Response: Response message and status code in JSON

   """
    content = request.json
    email = content['email']

    user = hf.find_user(email)

    if user != -1:
        # Send password reset link
        try:
            token = str(hf.generate_auth_token(
                user['document']['email']))[2:-1]
            reset_tokens[f"{token}"] = email
            print(reset_tokens)
            reset_link = f"http://127.0.0.1:3000/changepassword/?token={token}"
            hf.send_password_reset(user['document'], reset_link)
            print("Password reset email sent!")
        except:
            print("Something went wrong sending email")

    # return the same response no matter what the email is for security reasons
    return Response('{"Reason":"Password reset was sent to the email"}', status=200, mimetype='application/json')


@users.route('/users/reset_password', methods=['POST'])
def reset_password():
    """
    Description:
    Resets a user's password

    API Parameters:
    token (string): token

    Returns:
    Response: Response message and status code in JSON

   """
    content = request.json
    token = content['token']
    try:
        content['email'] = reset_tokens[f"{token}"]
    except:
        return Response('{"Reason":"Invalid Token"}', status=404, mimetype='application/json')

    print(reset_tokens)

    # check if expired
    if hf.auth_token_valid(token) == False:
        del reset_tokens[f'{token}']
        return Response('{"Reason":"Token expired"}', status=400, mimetype='application/json')

    if token in reset_tokens:
        user = hf.find_user(content['email'])

        if user == -1:
            return Response('{"Reason":"Invalid email provided"}', status=400, mimetype='application/json')

        res = hf.update_user_password(content)
        if res == True:
            del reset_tokens[f'{token}']
            return Response('{"Reason":"User password successfully updated"}', status=200, mimetype='application/json')
        else:
            return Response('{"Reason":"Something went wrong updating password"}', status=400, mimetype='application/json')

    else:
        return Response('{"Reason":"Token not authenticated"}', status=401, mimetype='application/json')
