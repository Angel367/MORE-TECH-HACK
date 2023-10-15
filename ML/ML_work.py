import sys

import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split 
from sklearn.linear_model import LinearRegression 
from sklearn import metrics


def MakePrediction(y, x):

    # среднее время ожидания в кокнетный день в конкретный временной промежуток
    # y = [] 

    # x = [
    #         [],
    #         []
    #     ]
    
    # формируем DataFrame из двух списков
    new_y = np.array(y) 
    new_y = new_y.transpose() 
    df1 = pd.DataFrame(new_y) 

    new_X = np.array(x) 
    new_X = new_X.transpose() 
    df2 = pd.DataFrame(new_X) 

    # назначаем ключи каждому полю исходных датафреймов
    df1 = df1.rename(columns = {0: 'Время ожидания'}, inplace = False)
    df2 = df2.rename(columns = {0: 'День', 1: 'Временной промежуток'}, inplace = False)
    frames = [df1, df2] 
    dataset = pd.concat([df1, df2], axis=1, join="inner") 

    print(dataset.head())
    print()

    # разделим данные на метки и атрибуты 
    X = dataset[['День', 'Временной промежуток']]
    y = dataset['Время ожидания']

    # разделим данные на обучающую и тестовую выборки
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state = 20)

    #для обучения алгоритма мы выполняем тот же код, что и раньше, используя метод fit() класса LinearRegression 
    regressor = LinearRegression()

    regressor.fit(X_train, y_train)
    # scaled encoded

    #выведем коэффициенты модели
    coeff_df = pd.DataFrame(regressor.coef_, X.columns, columns=['Coefficient']) 
    print(coeff_df)
    print()
    # Чтобы сделать прогнозы на тестовых данных, выполните следующий код 
    y_pred = regressor.predict(X_test) 
    df = pd.DataFrame({'Actual': y_test, 'Predicted': y_pred}) 
    print(df)
    print()
    #Последний шаг - оценить производительность алгоритма. Мы сделаем это, найдя значения для MSE
    print('Mean Squared Error:', metrics.mean_squared_error(y_test, y_pred))


    # составить прогноз на неделю по временным инетрвалам для услуг банка
    
    xTEST = np.array(x)
    xTEST = xTEST.transpose()
    xf = pd.DataFrame(xTEST)
    xf = xf.rename(columns = {0: 'День', 1: 'Временной промежуток'}, inplace = False)
    xTESTPredict = regressor.predict(xf)

        
    return xTESTPredict
    