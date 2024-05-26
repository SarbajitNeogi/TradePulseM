from flask import Flask, request, jsonify, send_file
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from flask_cors import CORS
from bson import ObjectId, json_util
from Data.FinanceData import getFinanceData
from Functions.Prediction import get_prediction
from LSTM.code import LSTM_wrapper
import numpy as np
from BitBotPro.algo import get_bit_algo

app = Flask(__name__)
CORS(app)
app.config['MONGO_URI'] = 'mongodb://localhost:27017/tradepulse'
mongo = PyMongo(app)

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({'error': 'Missing name, email, or password'}), 400

    existing_user = mongo.db.customers.find_one({'email': email})
    if existing_user:
        return jsonify({'error': 'Email already exists'}), 400

    hashed_password = generate_password_hash(password)
    new_user = {
        'name': name,
        'email': email,
        'password': hashed_password,
        'balance': 10000.00,
        'balancesheet': [10000.00],
        'activities': [{'time': datetime.now(), 'activity': 'Account Created'}]
    }


    result = mongo.db.customers.insert_one(new_user)
    new_user['_id'] = str(result.inserted_id)

    return jsonify({'success': True, 'user': new_user}), 201

@app.route('/signin', methods=['POST'])
def signin():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Missing email or password'}), 400

    user = mongo.db.customers.find_one({'email': email})
    if not user or not check_password_hash(user['password'], password):
        return jsonify({'error': 'Invalid email or password'}), 401

    activity = {'time': datetime.now(), 'activity': 'Signed In'}
    mongo.db.customers.update_one({'_id': user['_id']}, {'$push': {'activities': activity}})

    user['_id'] = str(user['_id'])

    return jsonify({'success': True, 'user': user}), 200

# @app.route('/<string:id>', methods=['GET'])
# def get_user_by_id(id):
#     user = mongo.db.customers.find_one({'_id': ObjectId(id)})
#     if not user:
#         return jsonify({'error': 'User not found'}), 404
    
#     user['_id'] = str(user['_id'])
    
#     return jsonify({'success': True, 'user': user}), 200

# GET /search?query=RE
@app.route('/search', methods=['GET'])
def get_search_suggestions():
    query = request.args.get('query')
    if query:
        symbols_data = list(mongo.db.symbols.find({'symbol': {'$regex': '^' + query, '$options': 'i'}}))
        return jsonify(symbols_data)
    else:
        return jsonify({'message': 'Please provide a query parameter'}), 400
    
# GET /symbols?screener=INDIA
@app.route('/symbols', methods=['GET'])
def get_symbols_by_screener():
    screener = request.args.get('screener')
    if screener:
        symbols_data = list(mongo.db.symbols.find({'screener': screener}))
        return jsonify(symbols_data)
    else:
        return jsonify({'message': 'Please provide a screener parameter in the query'}), 400

@app.route('/data', methods=['GET'])
def fetch_data():
    try:
        # Extract filters and search input from the request URL parameters
        filters = {key: request.args.get(key) for key in request.args if key not in ['search', '_id']}
        search_input = request.args.get('search')

        # Construct MongoDB query based on filters and search input
        mongo_query = {}
        if filters:
            mongo_query.update({key: value for key, value in filters.items() if value})  # Filter out None or empty strings
        if search_input:
            mongo_query['symbol'] = {'$regex': f'^{search_input}', '$options': 'i'}  # Perform a partial match search
        
        # Fetch data from the MongoDB collection based on the constructed query
        cursor = mongo.db.symbols.find(mongo_query)
        
        # Convert cursor to a list of dictionaries and serialize ObjectId to string
        data = json_util.dumps(cursor)

        return data
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/price/<string:symbol>', methods=['GET'])
def get_price(symbol):
    try:
        symbol_data = mongo.db.symbols.find_one({'symbol' : symbol})
        if symbol_data:
            if symbol_data.get('path') == 'NA':
                value = getFinanceData(f"{symbol_data.get('symbol')}:{symbol_data.get('exchange')}")
            else:
                value = getFinanceData(symbol_data.get('path'))
        return jsonify(value)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/suggestion', methods=['POST'])
def get_suggestion():
    data = request.get_json()
    symbol = data.get('symbol')
    interval = data.get('interval')

    try:
        symbol_data = mongo.db.symbols.find_one({'symbol' : symbol})
        if symbol_data:
            prediction = get_prediction(
                symbol_value=symbol_data.get('symbol'),
                screener_value=symbol_data.get('screener'),
                exchange_value=symbol_data.get('exchange'),
                interval_value=interval)
        return jsonify(prediction)
    except Exception as e:
        return jsonify({'error': str(e.message)})


@app.route('/update', methods=['POST'])
def update_user():
    data = request.get_json()
    email = data.get('email')
    new_balance = data.get('new_balance')
    activity = data.get('activity')

    try:
        user = mongo.db.customers.find_one({'email': email})
        if user:
            activities = user.get('activities')
            balance_sheet = user.get('balancesheet')
            balance_sheet.append(new_balance)
            activities.append({
                'time' : datetime.now(),
                'activity': activity
            })

            update_data = {
                '$set': {
                    'balance': new_balance,
                    'balancesheet': balance_sheet,
                    'activities': activities
                }
            }

            mongo.db.customers.update_one(
                {'email' : email}, update_data)
        else :
            return jsonify ({'error' : 'User not found'}), 500
        return jsonify ({'status' : 200, 'message': 'Updated successfully'})

    except Exception as e:
        return jsonify({'error': str(e.message)}), 500
    
@app.route('/predict_lstm/<string:symbol>', methods=['GET'])
def get_predict_chart(symbol):
    try:
        symbol_data = mongo.db.symbols.find_one({'symbol' : symbol})

        if symbol_data.get('exchange') == 'NSE':
            symbol = f'{symbol}.NS'

        sym_data = LSTM_wrapper(symbol)
        pred = sym_data.get_pred()
        pred_1d = [item for sublist in pred.tolist() for item in sublist]

        if symbol_data.get('exchange') != 'NSE':
            pred_1d = [item*83.5 for item in pred_1d]


        return jsonify({'predictions' : pred_1d})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/get_signal', methods=['POST'])
def get_signal():
    try:
        data = request.get_json()
        buy_price = data.get('buy_price')
        current_price = data.get('current_price')

        signal = get_bit_algo(buy_price, current_price)
        return jsonify({'signal' : signal})
    except Exception as e:
        return jsonify({'error': str(e)}), 500







if __name__ == '__main__':
    app.run(debug=True)
