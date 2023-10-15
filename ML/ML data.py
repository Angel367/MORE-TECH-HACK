from export import Export_predict_services_CSV
from ML_work import MakePrediction
import json

bank_USLIGI_PREDICT = {}
lastday = 6

Id_uslugi = 1

with open('ml_data_atm.json', 'r', encoding='utf-8') as input_file:
    source_json = json.load(input_file)
    for record in source_json:
        Bank_ID = record['id']
        y = record['y']
        x = record['x']
        print(Bank_ID, y, x)
        bank_USLIGI_PREDICT[Id_uslugi] = MakePrediction(y, x)
        print(Export_predict_services_CSV(bank_USLIGI_PREDICT, Bank_ID, lastday))