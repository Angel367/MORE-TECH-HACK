import pandas as pd
import os

def Export_predict_services_CSV(bank_USLIGI_PREDICT, BankID, lastday):
    # lastday = 4 # день конца рабочей недели в офисе


    path_to_file = 'ATM_ml_data' + '/SERVICES_prediction_week'+ str(BankID) +'.csv'

    my_df = []

    for Key in bank_USLIGI_PREDICT:
        arrPredict = bank_USLIGI_PREDICT[Key]
        # print(arr)
        day = 0
        time_day = 0

        for i in range(0,len(arrPredict)):
            my_df.append({
                'BankID': BankID,
                'FunctionList': Key,
                'Time': time_day,
                'Day': day,
                'Predict' : arrPredict[i]
            })       
            
            if (day == lastday):
                day = -1
                time_day+=1
            day += 1

    df = pd.DataFrame(my_df)
    # displaying the DataFrame 
    print('DataFrame:\n', df) 

    gfg_csv_data = df.to_csv(path_to_file, index = True)

    return path_to_file