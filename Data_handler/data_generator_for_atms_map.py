import json


# Функция для конвертации в новый формат

def convert_to_new_format(input_json):
    features = []
    id_counter = 1
    for data in input_json['atms']:
        coordinates = [data["latitude"], data["longitude"]]
        address = data["address"]
        if address == '' or not address:
            continue
        services = []
        for param, values in data["services"].items():
            if values["serviceActivity"] == "AVAILABLE":
                services.append(param)
        print(services)
        for i in range(0, len(services)):
            if services[i] == 'nfcForBankCards':
                services[i] = 'NFC (бесконтактное обслуживание)'
            elif services[i] == 'qrRead':
                services[i] = 'Платежи по QR-коду'
            elif services[i] == 'blind':
                services[i] = 'Доступен для слабовидящих и незрячих'
            elif services[i] == 'wheelchair':
                services[i] = 'Доступен для маломобильных граждан'
            elif services[i] == 'wheelchair':
                services[i] = 'Доступен для маломобильных граждан'
            elif services[i] == 'supportsChargeRub':
                services[i] = 'Внесение и выдача наличных'
            elif services[i] == 'supportsRub':
                services.remove('supportsRub')

        feature = {
            "type": "Feature",
            "id": id_counter,
            "address": address,
            "geometry": {
                "type": "Point",
                "coordinates": coordinates
            },
            "services": services,
            "name": "Банкомат",
            "isATM": True
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
with open("atms_data.json", "w", encoding='utf-8') as output_file:
    json.dump(new_format_json, output_file, ensure_ascii=False, indent=4)
