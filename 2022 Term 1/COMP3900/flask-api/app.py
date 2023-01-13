#! /usr/bin/env python3

from flask import Flask, jsonify, Blueprint
from flask_cors import CORS
from users.users import users
from products.products import products
from reservations.reservations import reservations
from orders.orders import orders
from auth import SECRET_KEY

app = Flask(__name__)
app.register_blueprint(users)
app.register_blueprint(products)
app.register_blueprint(reservations)
app.register_blueprint(orders)
app.config['SECRET_KEY'] = SECRET_KEY

CORS(app)


if __name__ == '__main__':
    app.run(debug=True)
