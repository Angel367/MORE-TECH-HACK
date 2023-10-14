import datetime
from operator import attrgetter, itemgetter

from dateutil.parser import parse
from dateutil.tz import tzoffset

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


class Office:
    id = None
    address = None
    is_atms = None
    has_suo = None
    list_offices = []

    def get_by_id(self, office_id):
        for o in self.list_offices:
            if o.id == office_id:
                return o

    def get_offices_suo(self):
        return [o for o in self.list_offices if not o.is_atms and o.has_suo]

    def get_offices_not_suo(self):
        return [o for o in self.list_offices if not o.is_atms and not o.has_suo]

    def get_offices_atms(self):
        return [o for o in self.list_offices if o.is_atms]

    def __init__(self, addr, is_atm, has_suo):
        self.id = len(self.list_offices)
        self.address = addr
        self.has_suo = has_suo
        self.is_atms = is_atm
        self.list_offices.append(self)
        self.id = len(self.list_offices)

    def clean(self):
        self.list_offices = []




class Operation:
    # for bankmat and office without suo
    id = None
    service_type = None
    start = None
    finish = None
    office = None
    list_operations = []

    def __init__(self, service_type=None, office=None, start=None, finish=None):
        self.service_type = int(service_type)
        self.office = office
        self.start = start
        self.finish = finish
        self.list_operations.append(self)
        self.id = len(self.list_operations)

        dt1 = parse(self.start)
        dt2 = parse(self.finish)
        parse("2015-02-24T13:00:00-08:00")


    def clean(self):
        self.list_operations = []

    def to_tuple(self):
        return (self.office.id,
                self.service_type,
                self.start.hour(),
                datetime.datetime.weekday(self.start.date),
                datetime.timedelta(self.finish - self.start)
                )

    def sort_list(self):
        list_ = [operation.to_tuple() for operation in self.list_operations]
        return sorted(list_, key=itemgetter(0, 1, 2, 3, 4))


class ServiceOffice:
    id = None
    name = None
    duration_waiting_in_minutes = None
    day = None
    hour = None
    office = None
    list_ser_offices = []

    def __init__(self, name, day_of_week, hour, office, duration_waiting_in_minutes=None):
        self.name = name
        self.day = day_of_week
        self.hour = hour
        self.office = office
        self.duration_waiting_in_minutes = duration_waiting_in_minutes
        self.list_ser_offices.append(self)
        self.id = len(self.list_ser_offices)

    def clean(self):
        self.list_ser_offices = []
