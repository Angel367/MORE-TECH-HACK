import json

with open('offices.json', 'r', encoding='utf-8') as input_file:
    source_json = json.load(input_file)

# Преобразование в нужный формат
features = []
id_counter = 1

list_time_interval = {
    '00:00': 0,
    '01:00': 1,
    '02:00': 2,
    '03:00': 3,
    '04:00': 4,
    '05:00': 5,
    '06:00': 6,
    '07:00': 7,
    '08:00': 8,
    '09:00': 9,
    '10:00': 10,
    '11:00': 11,
    '12:00': 12,
    '13:00': 13,
    '14:00': 14,
    '15:00': 15,
    '16:00': 16,
    '17:00': 17,
    '18:00': 18,
    '19:00': 19,
    '20:00': 20,
    '21:00': 21,
    '22:00': 22,
    '23:00': 23,
    'выход': -1,
    'одной': -1
}

list_week = {
    'пн': 0,
    'вт': 1,
    'ср': 2,
    'чт': 3,
    'пт': 4,
    'сб': 5,
    'вс': 6
}

for item in source_json:
    coordinates = [item["latitude"], item["longitude"]]
    services = [key for key, value in item.items() if value == "Y"]
    res = []


    # for ohi in item['openHoursIndividual']:
    #     if '-' in ohi["days"]:
    #         # Разделение диапазона дней недели
    #         start_day, end_day = ohi["days"].split('-')
    #         start_day_idx = list_week[start_day.strip()]
    #         end_day_idx = list_week[end_day.strip()]
    #
    #         for day_idx in range(start_day_idx, end_day_idx + 1):
    #             res_item = {
    #                 'day': day_idx,
    #                 'open_hour': list_time_interval[ohi["hours"][:5]],
    #                 'close_hour': list_time_interval[ohi["hours"][-5:]]
    #             }
    #             res.append(res_item)
    #     else:
    #         # Разделение дней недели, указанных через запятую
    #         days = ohi["days"].split(',')
    #         for day in days:
    #             res_item = {
    #                 'day': list_week[day.strip()],
    #                 'open_hour': list_time_interval[ohi["hours"][:5]],
    #                 'close_hour': list_time_interval[ohi["hours"][-5:]]
    #             }
    #             res.append(res_item)
    # Функция для разделения дней недели в формате "пн-пт" на отдельные дни
    def expand_days(day_range):
        days = []
        if ',' in day_range:
            day_ranges = day_range.split(',')
        elif '-' in day_range:
            day_ranges = day_range.split('-')
        else:
            day_ranges = day_range.split(',')
        print(day_ranges)
        if day_ranges == ['Не обслуживает ЮЛ']:
            return ['no']
        elif day_ranges == ['пн', 'пт']:
            days.append("пн")
            days.append("вт")
            days.append("ср")
            days.append("чт")
            days.append("пт")
        elif day_ranges == ['пн', 'чт']:
            days.append("пн")
            days.append("вт")
            days.append("ср")
            days.append("чт")
        else:
            for day_range in day_ranges:
                days.append(day_range)
        return days


    # Функция для конвертации в желаемый формат
    def convert_to_desired_format(input_json, type):
        output_json = {
            type: []
        }

        for entry in input_json.get(type, []):
            #print(entry)
            days = expand_days(entry["days"])
            #print(days)
            hours = entry["hours"]

            for day in days:
                output_json[type].append({"days": day, "hours": hours})

        return output_json


    feature = {
        "type": "Feature",
        "id": id_counter,
        "geometry": {
            "type": "Point",
            "coordinates": coordinates
        },
        "services": services,
        "open_hours_individual": convert_to_desired_format(item, "openHoursIndividual")['openHoursIndividual'],
        "open_hours": convert_to_desired_format(item, "openHours")["openHours"]

    }

    features.append(feature)
    id_counter += 1

output_json = {
    "type": "FeatureCollection",
    "features": features
}

# Сохранение результата в JSON файл
with open('offices_data.json', 'w', encoding='utf-8') as output_file:
    json.dump(output_json, output_file, ensure_ascii=False, indent=4)

print("Готово! Результат сохранен в output.json")
