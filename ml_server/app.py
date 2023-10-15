import atexit
import csv
import json

import requests
from apscheduler.schedulers.background import BackgroundScheduler
from flask import Flask, jsonify, request, Response

from models import *
from panda import *

app = Flask(__name__)
app.config.from_pyfile('config.py')
BASE_path = ''
POINT_TYPE = [
    (0, "Б"),  # Банкоматы
    (1, "С"),  # СОУ
    (2, "О"),  # Отсутствует СОУ
]

SERVICE_CHOICES = [
    (0, "Вклады"),  # Вклады
    (1, "Кредиты"),  # Кредиты
    (2, "Страхование"),  # Страхование
]


def calculate():
    get_data_from_api()
    # for office in Office.get_offices_suo():
    #
    # results = []
    # result_dict = results.__dict__  # 0..1 -> 0 1 2
    # result_dict.pop('_sa_instance_state')


def get_data_from_api():
    # print("get_from_api")
    offices = requests.get("http://127.0.0.1:5000/offices").json()
    office = []
    for office in offices:
        office = Office(office["address"], office["is_atms"], office["has_suo"])
    operations = requests.get("http://127.0.0.1:5000/operations").json()
    coupons = requests.get("http://127.0.0.1:5000/coupons").json()
    for operation in operations:
        for coupon in coupons:
            if coupon["operation_id"] == operation["id"]:
                start = coupon["created"]
                finish = operation["opened"]
            else:
                start = operation["opened"]
                finish = operation["closed"]
                Operation(service_type=operation["service_type"],
                          start=start,
                          finish=finish,
                          office=office.get_by_id(operation["office_id"])
                          )


@app.route('/get_office', methods=['GET'])
def get_ml_data():
    # Получите параметры запроса: BankID, FunctionList, Time, Day
    bank_id = int(request.args.get('BankID'))
    function_list = int(request.args.get('FunctionList'))
    time = int(request.args.get('Time'))
    day = int(request.args.get('Day'))
    data = pd.read_csv('Office_ml_data/SERVICES_prediction_week'+str(bank_id)+'.csv')
    # Фильтруйте данные на основе параметров запроса
    filtered_data = data[(data['BankID'] == bank_id) & (data['FunctionList'] == function_list) & (data['Time'] == time)]

    if not filtered_data.empty:
        # Извлеките значение Predict
        predict_value = filtered_data['Predict'].values
        print(predict_value)
        average = 0
        for item in predict_value:
            average += int(item)
        average /= len(predict_value)
        return jsonify({'Predict': average})
    else:
        return jsonify({'error': 'No matching data found'})


@app.route('/get_atm', methods=['GET'])
def get_ml_data():
    # Получите параметры запроса: BankID, FunctionList, Time, Day
    bank_id = int(request.args.get('BankID'))
    function_list = int(request.args.get('FunctionList'))
    time = int(request.args.get('Time'))
    day = int(request.args.get('Day'))
    data = pd.read_csv('Office_ml_data/SERVICES_prediction_week'+str(bank_id)+'.csv')
    # Фильтруйте данные на основе параметров запроса
    filtered_data = data[(data['BankID'] == bank_id) & (data['FunctionList'] == function_list) & (data['Time'] == time)]

    if not filtered_data.empty:
        # Извлеките значение Predict
        predict_value = filtered_data['Predict'].values
        print(predict_value)
        average = 0
        for item in predict_value:
            average += int(item)
        average /= len(predict_value)
        return jsonify({'Predict': average})
    else:
        return jsonify({'error': 'No matching data found'})



if __name__ == '__main__':
    # Shut down the scheduler when exiting the app
    calculate()
    scheduler = BackgroundScheduler()
    scheduler.add_job(func=calculate, trigger="interval", minutes=1)
    scheduler.start()
    atexit.register(lambda: scheduler.shutdown())
    app.run(debug=True, use_reloader=False, host='127.0.0.1', port=5001)
