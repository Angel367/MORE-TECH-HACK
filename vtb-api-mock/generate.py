import math
import random
import datetime
import json
from models import *


def create_data():
    # from pprint import pprint

    json_file = 'atms.json'
    with open(json_file) as json_data:
        data = json.load(json_data)
    for one in data["atms"]:
        db.session.add(Office(one["address"], True, False))
    json_file = 'offices.json'
    with open(json_file) as json_data:
        data = json.load(json_data)
    for one in data["offices"]:
        db.session.add(Office(one["address"], True, one['suoAvailability'] == "Y"))
    db.session.commit()

    for i in range(1, 100):
        o = Manager(f"manager{i}", random.choice(list(Office.query.all())).id)
        for j in range(0, 10):
            w = AppointmentWindow(random.choice(SERVICE_CHOICES)[0],
                                  manager_id=o.id,
                                  date_time_appointment=datetime.datetime(2023, 10, 14 + i,
                                                                          random.randint(10, 17),
                                                                          10 * math.floor(5.0 + random.random())))
            db.session.add(w)
        db.session.add(o)
    db.session.commit()

    for i in range(0, 100):
        o = Client(fio=f"client{i}", manager_id=random.choice(list(Manager.query.all())).id)
        for j in range(0, 2):
            w = AppointmentWindow(random.choice(SERVICE_CHOICES)[0],
                                  random.choice(SERVICE_CHOICES)[0],
                                  date_time_appointment=datetime.datetime(2023, 10, 14 + j,
                                                                          random.randint(10, 17),
                                                                          10 * math.floor(5.0 + random.random())))
            db.session.add(w)
        db.session.add(o)
    db.session.commit()
    windows = AppointmentWindow.query.all()
    for client in Client.query.all():
        if client.manager_id is None:
            if random.choice([True, True, False]):
                o = Coupon(random.randint(0, 100),
                           random.choice(SERVICE_CHOICES)[0],
                           client_id=client.id,
                           office_id=random.choice(list(Office.query.all())).id)
                db.session.add(o)
            else:
                for window in windows:
                    if window.manager_id is not None:
                        window.is_busy = True
                        appoint = Appointment(client_id=client.id, window_appointment_id=window.iw,
                                              date_time_arrive=datetime.datetime(2023, 10,
                                                                                 window.date_time_appointment.day,
                                                                                 window.date_time_appointment.hour,
                                                                                 window.date_time_appointment.minute
                                                                                 - random.randint(0, 5)))
                        db.session.add(appoint)

        else:
            for window in windows:
                if window.manager_id is None:
                    window.is_busy = True
                    appoint = Appointment(client_id=client.id, window_appointment_id=window.id,
                                          date_time_arrive=datetime.datetime(2023, 10,
                                                                             window.date_time_appointment.day,
                                                                             window.date_time_appointment.hour,
                                                                             window.date_time_appointment.minute + 10 -
                                                                             random.randint(0, 10)))
                    db.session.add(appoint)
        db.session.commit()
