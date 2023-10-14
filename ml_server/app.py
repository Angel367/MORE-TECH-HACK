import atexit
import csv

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


@app.route('/index', methods=['POST'])
def get_ml_data():
    # request.headers['Content-Type'] = "application/json"
    data = request.get_json()
    data = []
    with open("dir/SERVICES_prediction_week.csv", encoding="utf-8") as f:
        f_reader = csv.reader(f, delimiter=",")
        list_ = []
        for row in f_reader:
            office = office.get_by_id(row[1])
            if 'office_id' in data and office.id != data['office_id']:
                continue
            if 'is_atms' in data and (data['is_atms'] == True
                                      and not office.is_atms or
                                      data['is_atms'] != True
                                      and office.is_atms):
                continue
            if 'has_suo' in data and (data['has_suo'] == True
                                      and not office.has_suo or
                                      data['has_suo'] != True
                                      and office.has_suo):
                continue
            if 'id_service' in data and data['id_service'] != row[2]:
                continue
            list_ = ServiceOffice(office=office,
                                  name=row[2],
                                  day_of_week=row[4],
                                  hour=row[3],
                                  duration_waiting_in_minutes=row[5])
        print(list_.list_ser_offices.__dict__)
        return jsonify(list_.list_ser_offices.__dict__), 200, {'Content-Type': 'application/json'}


if __name__ == '__main__':
    # Shut down the scheduler when exiting the app
    calculate()
    scheduler = BackgroundScheduler()
    scheduler.add_job(func=calculate, trigger="interval", minutes=1)
    scheduler.start()
    atexit.register(lambda: scheduler.shutdown())
    app.run(debug=True, use_reloader=False, host='127.0.0.1', port=5001)
