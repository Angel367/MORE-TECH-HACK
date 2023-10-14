import json

from flask import Flask, jsonify, request
from models import *
from generate import create_data
app = Flask(__name__)
app.config.from_pyfile('config.py')
db.init_app(app)
app.json.ensure_ascii = False


@app.route('/operations', methods=['GET'])
def get_operations():
    coupons = Operation.query.order_by('office_id', "service_type")
    coupons_dict = [coupon.__dict__ for coupon in coupons]
    for coupon_dict in coupons_dict:
        coupon_dict.pop('_sa_instance_state')
    return jsonify(coupons_dict)


@app.route('/operations/<int:id_operation>', methods=['GET'])
def get_operation(id_operation):
    coupon = Operation.query.get(id_operation)
    if coupon is None:
        return jsonify({'message': 'Операция не найдена'}), 404
    else:
        coupon_dict = coupon.__dict__
        coupon_dict.pop('_sa_instance_state')
        return jsonify(coupon_dict)


@app.route('/operations', methods=['POST'])
def create_operation():
    data = request.get_json()
    if 'office_id' not in data or 'service_type' not in data or 'client_id' not in data:
        # Return a 400 error if missing name or email
        return jsonify({'message': 'Тип операции, номер талона, id отделения обязательны для заполнения'}), 400
    Office.query.get_or_404(data['office_id'], 'Неверно введен номер отделения')
    operation = Operation( office_id=data['office_id'],
                          service_type=data['service_type'], client_id=data['client_id'])
    db.session.add(operation)
    db.session.commit()
    coupon_dict = operation.__dict__
    coupon_dict.pop('_sa_instance_state')
    return jsonify(coupon_dict), 201


@app.route('/coupons', methods=['GET'])
def get_coupons():
    coupons = Coupon.query.all()
    coupons_dict = [coupon.__dict__ for coupon in coupons]
    for coupon_dict in coupons_dict:
        coupon_dict.pop('_sa_instance_state')
    return jsonify(coupons_dict)


@app.route('/offices_with_details/offices', methods=['GET'])
def get_offices_with_details_offices():
    json_file = 'offices.json'
    with open(json_file, encoding="utf8") as json_data:
        return json.load(json_data)


@app.route('/offices_with_details/atms', methods=['GET'])
def get_offices_with_details_atms():
    json_file = 'atms.json'
    with open(json_file, encoding="utf8") as json_data:
        return json.load(json_data)


@app.route('/offices', methods=['GET'])
def get_offices():
    coupons = Office.query.all()
    coupons_dict = [coupon.__dict__ for coupon in coupons]
    for coupon_dict in coupons_dict:
        coupon_dict.pop('_sa_instance_state')
    return jsonify(coupons_dict)


@app.route('/coupons/<int:id_coupon>', methods=['GET'])
def get_coupon(id_coupon):
    coupon = Coupon.query.get(id_coupon)
    if coupon is None:
        return jsonify({'message': 'Талон не найден'}), 404
    else:
        coupon_dict = coupon.__dict__
        coupon_dict.pop('_sa_instance_state')
        return jsonify(coupon_dict)


@app.route('/coupons', methods=['POST'])
def create_coupon():
    data = request.get_json()
    if 'office_id' not in data or 'service_type' not in data or 'client_id' not in data:
        return jsonify({"message": "Тип операции, номер талона, id отделения обязательны для заполнения"}), 400
    Office.query.get_or_404(data['office_id'], 'Неверно введен номер отделения')
    operation = Operation(office_id=data['office_id'], service_type=data['service_type'], client_id=data['client_id'])
    db.session.add(operation)
    db.session.commit()
    coupon = Coupon(operation_id=operation.id)
    db.session.add(coupon)
    db.session.commit()
    coupon_dict = coupon.__dict__
    coupon_dict.pop('_sa_instance_state')
    return jsonify(coupon_dict), 201


@app.route('/appointments', methods=['POST'])
def create_appointment():
    data = request.get_json()
    if 'window_id' not in data or 'office_id' not in data or 'service_type' not in data or 'client_id' not in data:
        # Return a 400 error if missing name or email
        return jsonify({'message': 'Тип операции, номер талона, id отделения обязательны для заполнения'}), 400
    elif 'office_id' not in data:
        return jsonify({'message': 'Неверно введен номер отделения'}), 400
    else:
        coupon = Appointment(client_id=data['client_id'], )
        db.session.add(coupon)
        db.session.commit()
        coupon_dict = coupon.__dict__
        coupon_dict.pop('_sa_instance_state')
        return jsonify(coupon_dict), 201


@app.route('/windows', methods=['GET'])
def get_windows():
    windows = AppointmentWindow.query.all()
    windows_dict = [window.__dict__ for window in windows]
    for coupon_dict in windows_dict:
        coupon_dict.pop('_sa_instance_state')
    return jsonify(windows_dict)


# @app.route('/appointments', methods=['GET'])
# def get_appointments():
#     coupons = Appointment.query.all()
#     coupons_dict = [coupon.__dict__ for coupon in coupons]
#     for coupon_dict in coupons_dict:
#         coupon_dict.pop('_sa_instance_state')
#     return jsonify(coupons_dict)
@app.route('/offices/<int:office_id>/managers', methods=['GET'])
def get_managers_by_id_office(office_id):
    managers = Manager.query.filter_by(office_id=office_id)
    windows = AppointmentWindow.query.order_by('date_time_appointment')
    manager_dict = [window.__dict__ for window in managers]
    windows_dict = [window.__dict__ for window in windows]
    for coupon_dict in windows_dict:
        coupon_dict.pop('_sa_instance_state')
    for coupon_dict in manager_dict:
        coupon_dict.pop('_sa_instance_state')
        coupon_dict.update({"windows": [dict(window) for window in windows_dict
                                        if window["manager_id"] == coupon_dict["id"]]})

    return jsonify(manager_dict)


@app.route('/appointments/<int:id_appointment>', methods=['GET'])
def get_client(id_appointment):
    appointment = Client.query.get(id_appointment)
    if appointment is None:
        return jsonify({'message': 'Запись не найден'}), 404
    else:
        appointment = appointment.__dict__
        appointment.pop('_sa_instance_state')
        return jsonify(appointment)


if __name__ == '__main__':
    # with app.app_context():
    #     db.drop_all()
    #     db.create_all()
    #     create_data()
    app.run(debug=True, use_reloader=False)
