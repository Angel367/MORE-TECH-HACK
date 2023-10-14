from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func

db = SQLAlchemy()

CLIENT_CHOIСES = [
    (0, "Юр.лиц"),  # Юр.лиц
    (1, "Физ.лиц"),  # Физ.лиц
    (2, "VIP")  # VIP
]

SERVICE_CHOICES = [
    (0, "Вклады"),  # Вклады
    (1, "Кредиты"),  # Кредиты
    (2, "Страхование"),  # Страхование
]

BENEFITS_CHOICES = [
    (1, "Нет"),
    (2, "Инвалид"),
    (2, "Юрлицо"),
    (3, "Привилегия"),
]


class Office(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    address = db.Column(db.String(100), nullable=False)
    is_atms = db.Column(db.Boolean, nullable=False, default=True)
    has_suo = db.Column(db.Boolean, nullable=False, default=True)

    def __init__(self, addr, is_atm, has_suo):
        self.address = addr
        self.has_suo = has_suo
        self.is_atms = is_atm

    def __repr__(self):
        return f'{self.name}'


class Manager(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fio = db.Column(db.String(100), nullable=False)
    office_id = db.Column(db.Integer, db.ForeignKey('office.id'))

    def __init__(self, fio="fio", office_id=None):
        self.fio = fio
        self.office_id = office_id


class Client(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    fio = db.Column(db.String(100), nullable=False)
    manager_id = db.Column(db.Integer, db.ForeignKey('manager.id'))
    client_type = db.Column(db.Integer, nullable=False)
    is_verified = db.Column(db.Boolean, nullable=False, default=True)

    def __init__(self,  fio="fio", manager_id=None):

        self.fio = fio
        self.manager_id = manager_id
        if manager_id is None:
            self.client_type = CLIENT_CHOIСES[1][0]
        else:
            self.client_type = CLIENT_CHOIСES[0][0]


class AppointmentWindow(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    manager_id = db.Column(db.Integer, db.ForeignKey('manager.id'))
    service_type = db.Column(db.Integer, nullable=False)
    date_time_appointment = db.Column(db.DateTime, nullable=False)
    is_busy = db.Column(db.Integer, default=False)

    def __init__(self, service_type, manager_id=None, date_time_appointment=None):
        self.service_type = service_type
        self.date_time_appointment = date_time_appointment
        if Manager.query.filter_by(id=manager_id).count() > 0:
            self.manager_id = manager_id
        else:
            self.manager_id = None

    def __repr__(self):
        return f'{SERVICE_CHOICES[self.service_type]}_{self.date_time_appointment}'


class Appointment(db.Model):  # предзапись для физ для некоторых операций и запись для юр
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'), nullable=False)
    window_appointment_id = db.Column(db.Integer, db.ForeignKey('appointment_window.id'),  nullable=False)
    date_time_arrive = db.Column(db.DateTime, nullable=False)

    def __init__(self, window_appointment_id=None, client_id=None, date_time_arrive=None, is_busy=False):
        if Client.query.filter_by(id=client_id).count() > 0:
            self.client_id = client_id
        else:
            self.client_id = None
        if AppointmentWindow.query.filter_by(id=window_appointment_id).count():
            self.window_appointment_id = window_appointment_id
            AppointmentWindow.query.get(window_appointment_id).is_busy = is_busy
        else:
            self.window_appointment_id = None
        self.date_time_arrive = date_time_arrive

    def __repr__(self):
        return f'{SERVICE_CHOICES[self.service_type][1]}_{self.window_appointment}_{self.date_time}'

#
# # для как можно быстрее  выводим время примерноеML до вызова
# # для приду ко времени вносим его запить в очерез за примерноеML до вызова


class Operation(db.Model):
    #for bankmat and office without suo
    id = db.Column(db.Integer, primary_key=True)
    service_type = db.Column(db.Integer, nullable=False)
    opened = db.Column(db.DateTime, default=None, nullable=True)  # time finish
    closed = db.Column(db.DateTime, default=None, nullable=True)  #
    office_id = db.Column(db.Integer, db.ForeignKey('office.id'), nullable=False)
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'), nullable=False)

    def __init__(self, service_type, office_id, created=None, opened=None, closed=None, benefits=False,
                 client_id=None):
        self.service_type = int(service_type)
        if Office.query.filter_by(id=office_id).count() > 0:
            self.office_id = office_id
        else:
            self.office_id = None
        if created is not None:
            self.created = created
        if opened is not None:
            self.opened = opened
        if closed is not None:
            self.closed = closed
        self.benefits = benefits
        if Client.query.filter_by(id=client_id).count() > 0:
            self.client_id = client_id
        else:
            self.client_id = None

    def __repr__(self):
        return f'{SERVICE_CHOICES[self.service_type][1]}{self.num}'


class Coupon(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    num = db.Column(db.Integer)  # ограничения на 3 цифры заполняется у них
    created = db.Column(db.DateTime(timezone=True), nullable=False, server_default=func.now())
    benefits = db.Column(db.Boolean, nullable=False, default=False)
    operation_id = db.Column(db.Integer, db.ForeignKey('operation.id'))

    def __init__(self, created=None, operation_id=None):

        if len(Coupon.query.all()) == 0 or Coupon.query.order_by(self.num).first().num > 999:
            self.num = 0
        else:
            self.num = Coupon.query.order_by(self.num).first().num + 1
        self.operation_id = operation_id
        if created is not None:
            self.created = created

    def __repr__(self):
        return f'{SERVICE_CHOICES[self.service_type]}'



