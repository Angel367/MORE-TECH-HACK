import json

with open('offices.json', 'r', encoding='utf-8') as input_file:
    source_json = json.load(input_file)

# Преобразование в нужный формат
features = []
id_counter = 1

days_map

for item in source_json:
    coordinates = [item["latitude"], item["longitude"]]
    services = [key for key, value in item.items() if value == "Y"]
    open_hours_individual = []
    for hour in item['openHoursIndividual']:
        if hour['days'] == 'пн-чт':
            res = [
                {
                    'days': 0,
                    'hours':
                }
            ]
        open_hours_individual.append(
            hour
        )
    print(open_hours_individual)

    feature = {
        "type": "Feature",
        "id": id_counter,
        "geometry": {
            "type": "Point",
            "coordinates": coordinates
        },
        "services": services,
        "open_hours_individual":
            open_hours_individual

    }

    features.append(feature)
    id_counter += 1

output_json = {
    "type": "FeatureCollection",
    "features": features
}

# Сохранение результата в JSON файл
with open('output.json', 'w', encoding='utf-8') as output_file:
    json.dump(output_json, output_file, ensure_ascii=False, indent=4)

print("Готово! Результат сохранен в output.json")
