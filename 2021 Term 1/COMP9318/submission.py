import math
import numpy as np
import pandas as pd
from sklearn.svm import SVR
from sklearn.preprocessing import MinMaxScaler,RobustScaler
from sklearn.metrics import mean_absolute_error

## Project-Part1
def predict_COVID_part1(svm_model, train_df, train_labels_df, past_cases_interval, past_weather_interval, test_feature):
    
    n_rows = train_df.shape[0]
    n_columns = train_df.shape[1]
    n_instances = 30
    empty_array = np.zeros(shape=(n_rows-n_instances,(n_columns-1)*n_instances))
    feature_matrix = pd.DataFrame(empty_array, columns=test_feature.index[1:])
    
    # make a feature matrix for train data
    tmp_row = list()
    for row in range(0,n_rows-n_instances): # 162 iteration
        tmp_row = list()
        for column in range(1,n_columns): # 17 iteration
            day30_data = train_df.iloc[row:row+n_instances,column]    
            for num in range(n_instances): # 30 iteration
                tmp_row.append(day30_data.values[num])
        feature_matrix.iloc[row] = tmp_row        
    
    # i.e) past_weather_interval = 10 / past_cases_interval = 10
    # [max_temp, max_dew, max_humid, past_cases]
    
    case_index = [i for i in range(1,past_cases_interval+1)]
    weather_index = [i for i in range(1,past_weather_interval+1)]
    
    case = ['dailly_cases-'+str(i) for i in case_index]
    temp = ['max_temp-'+str(i) for i in weather_index]
    dew = ['max_dew-'+str(i) for i in weather_index]
    humid = ['max_humid-'+str(i) for i in weather_index]
    case_weather = case + temp + dew + humid
    
    train_X_matrix = feature_matrix[case_weather]
    test_X_matrix = test_feature[case_weather]
    
    
    X_train = train_X_matrix.values
    y_train = train_labels_df.iloc[n_instances:,-1:].values.ravel()
    X_test = test_X_matrix.values
    X_test = X_test.reshape(1,-1)

    svr = svm_model.fit(X_train,y_train)
    y_pred = math.floor(svr.predict(X_test))
    
    return y_pred


## Parameters settings
past_cases_interval = 10
past_weather_interval = 10

## Read training data
train_file = 'C:/Users/user/Desktop/class/2021 Term1/COMP9318/COMP9318_Project/data/COVID_train_data.csv'
train_df = pd.read_csv(train_file)

## Read Training labels
train_label_file = 'C:/Users/user/Desktop/class/2021 Term1/COMP9318/COMP9318_Project/data/COVID_train_labels.csv'
train_labels_df = pd.read_csv(train_label_file)

## Read testing Features
test_fea_file = 'C:/Users/user/Desktop/class/2021 Term1/COMP9318/COMP9318_Project/data/test_features.csv'
test_features = pd.read_csv(test_fea_file)

## MeanAbsoluteError Computation...!

test_label_file ='C:/Users/user/Desktop/class/2021 Term1/COMP9318/COMP9318_Project/data/COVID_test_labels.csv'
test_labels_df = pd.read_csv(test_label_file)
ground_truth = test_labels_df['dailly_cases'].to_list()



## Project-Part2
def predict_COVID_part2(train_df, train_labels_df, test_feature):
    
    svm_model = SVR()
    svm_model.set_params(**{'kernel':'rbf','degree': 1, 'C':10000,
                        'gamma': 'scale', 'coef0': 0.0, 'tol': 0.001, 'epsilon':0.01})
    
    # standardize
    scaler1 = RobustScaler()
    scaled_df = scaler1.fit_transform(train_df)
    train_df = pd.DataFrame(data=scaled_df)
    
    n_rows = train_df.shape[0]
    n_columns = train_df.shape[1]
    n_instances = 30
    empty_array = np.zeros(shape=(n_rows-n_instances,(n_columns-1)*n_instances))
    feature_matrix = pd.DataFrame(empty_array, columns=test_feature.index[1:])
    
    past_cases_interval = 10
    past_weather_interval = 9

    # make a feature matrix for train data
    tmp_row = list()
    for row in range(0,n_rows-n_instances):
        tmp_row = list()
        for column in range(1,n_columns):
            day30_data = train_df.iloc[row:row+n_instances,column]    
            for num in range(n_instances): # 30 iteration
                tmp_row.append(day30_data.values[num])
        feature_matrix.iloc[row] = tmp_row        
    
    
    weather_index = [i for i in range(1,past_weather_interval+1)]
    case_index = [i for i in range(1,past_cases_interval+1)]
    
    max_temp = ['max_temp-'+str(i) for i in weather_index]
    max_humid = ['max_humid-'+str(i) for i in weather_index]
    max_dew = ['max_dew-'+str(i) for i in weather_index]
    case = ['dailly_cases-'+str(i) for i in case_index]
    
    weather_case = max_temp + max_humid + max_dew + case
    
    train_X_matrix = feature_matrix[weather_case]
    test_X_matrix = test_feature[weather_case]
    
    
    X_train = train_X_matrix.values
    y_train = train_labels_df.iloc[n_instances:,-1:].values.ravel()
    X_test = test_X_matrix.values
    X_test = X_test.reshape(1,-1)
    
    svr = svm_model.fit(X_train,y_train)
    y_pred = math.floor(svr.predict(X_test))
    
    return y_pred

## Generate Prediction Results
predicted_cases_part2 = []
for idx in range(len(test_features)):
    test_feature = test_features.loc[idx]
    prediction = predict_COVID_part2(train_df, train_labels_df, test_feature)
    predicted_cases_part2.append(prediction)
    
MeanAbsError = mean_absolute_error(predicted_cases_part1, ground_truth)
print('MeanAbsError = ', MeanAbsError)    
    