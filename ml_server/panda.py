import pandas as pd
import os

def Export_predict_services_CSV(bank_USLIGI_PREDICT, BankID, lastday):
    # lastday = 4 # день конца рабочей недели в офисе

    if not(os.path.exists( str(BankID) )):
        os.mkdir(str(BankID))

    path_to_file = str(BankID) + '/SERVICES_prediction_week_.csv'

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
    

def __Export_To_CSV_Prediction(xTESTPredict, BankID, UslugiType_ID):

    lastday = 4 # день конца рабочей недели в офисе

    my_df = []
    
    day = 0
    time_day = 0
    for i in range(0,len(xTESTPredict)):
        my_df.append({
            'BankID': 'Bank_id1',
            'FunctionList': "Functions1",
            'Time': time_day,
            'Day': day,
            'Predict' : xTESTPredict[i]
        })       
        
        if (day == lastday):
            day = -1
            time_day+=1
        day += 1

    # print()
    df = pd.DataFrame(my_df) 
    
    # displaying the DataFrame 
    print('DataFrame:\n', df) 
    
    if not(os.path.exists( str(BankID) )):
        os.mkdir(str(BankID))

    path_to_file = str(BankID) + '/SERVICES_' + str(UslugiType_ID)  + '_prediction_week.csv'

    # saving the DataFrame as a CSV file 
    gfg_csv_data = df.to_csv(path_to_file, index = True) 
    print('\nCSV String:\n', gfg_csv_data) 


    return path_to_file