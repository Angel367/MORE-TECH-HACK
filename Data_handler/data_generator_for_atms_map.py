import json

# Функция для конвертации в новый формат

def convert_to_new_format(input_json):
    features = []
    id_counter = 1
    for data in input_json['atms']:
        coordinates = [data["latitude"], data["longitude"]]
        services = []
        if data["latitude"] == 55.748914:
            print('')
        for param, values in data["services"].items():
            if values["serviceActivity"] == "AVAILABLE":
                services.append(param)


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

    feature_collection = {
        "type": "FeatureCollection",
        "features": features
    }
    return feature_collection

# Считываем входные данные из файла
with open("atms.json", "r", encoding='utf-8') as input_file:
    input_data = json.load(input_file)

# Преобразуем данные в новый формат
new_format_json = convert_to_new_format(input_data)

# Записываем результат в файл
with open("atms_data.json", "w") as output_file:
    json.dump(new_format_json, output_file, indent=4)
