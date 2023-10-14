import json

with open('atms.json', 'r', encoding='utf-8') as input_file:
    source_json = json.load(input_file)

# Преобразование в нужный формат
features = []
id_counter = 1

for item in source_json:
    coordinates = [item["latitude"], item["longitude"]]
    services = [key for key, value in item.items() if value == "Y"]

    feature = {
        "type": "Feature",
        "id": id_counter,
        "geometry": {
            "type": "Point",
            "coordinates": coordinates
        },
        "services": services
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
