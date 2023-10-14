from asyncio import tasks

from flask import Flask, jsonify, request

from ml_server.models import *
from ml_server.panda import *

app = Flask(__name__)
app.config.from_pyfile('config.py')
db.init_app(app)

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


#
# BENEFITS_CHOICES = [
#     (0, "Нет"),
#     (1, "Инвалид"),
#     (2, "Привилегия"),
#     (3, "Юрлицо"),
# ]


# parametrs
# id, type_serv, day, period


@app.route('/calculate', methods=['GET'])
def calculate():
    data = request.get_json()
    results = []
    result_dict = results.__dict__  # 0..1
    result_dict.pop('_sa_instance_state')
    return jsonify(result_dict), 200


@tasks.loop(minute=1)  # week=1
async def my_task():
    results = []
    export_to_csv_prediction([])


my_task.start()

if __name__ == '__main__':
    app.run(debug=True, use_reloader=False, host='127.0.0.1', port=5001)
