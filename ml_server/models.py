from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


CLIENT_TYPE = [
    (0, "Ю"),  # Юр.лиц
    (1, "Ф"),  # Физ.лиц
    (2, "В")  # VIP
]
SERVICE_CHOICES = [
    (0, "В"),  # Вклады
    (1, "К"),  # Кредиты
    (2, "С"),  # Страхование
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


class ServiceGroup(db.Model):
    name = db.Column(db.String(100), nullable=False)
    duration_waiting_in_minutes = db.Column(db.Float, nullable=False)

    def __init__(self, name, duration_waiting_in_minutes):
        self.name = name
        self.duration_waiting_in_minutes = duration_waiting_in_minutes
