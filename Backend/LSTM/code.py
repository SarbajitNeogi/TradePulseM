import pandas as pd
import numpy as np

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt


import yfinance as yf
from pandas_datareader import data as pdr

yf.pdr_override()

from datetime import datetime
end = datetime.now()
start = datetime(end.year - 1, end.month, end.day)

from keras.models import Sequential
from keras.layers import Dense, LSTM

from sklearn.preprocessing import MinMaxScaler

import io

class LSTM_wrapper:
  def __init__(self, symbol:str):
    self.symbol = symbol
    self.df = pdr.get_data_yahoo(symbol, start='2020-01-01', end=datetime.now())
    self.x_train, self.y_train, self.training_data_len, self.scaled_data, self.scaler = self.preprocessing()
    self.model = self.create_model()
    self.model.compile(optimizer='adam', loss='mean_squared_error')
    self.model.fit(self.x_train, self.y_train, batch_size=1, epochs=1)
    self.predictions= self.get_pred()

  def get_analysis(self):
    ma_day = [10, 20, 50]

    for ma in ma_day:
      column_name = f"MA for {ma} days"
      self.df[column_name] = self.df['Adj Close'].rolling(ma).mean()

    plt.figure(figsize=(15,10))
    self.df[['Adj Close', 'MA for 10 days', 'MA for 20 days', 'MA for 50 days']].plot()
    plt.legend()

    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    plt.clf()

    return buffer
  
  def create_model(self):
    model = Sequential()
    model.add(LSTM(128, return_sequences=True, input_shape= (self.x_train.shape[1], 1)))
    model.add(LSTM(64, return_sequences=False))
    model.add(Dense(25))
    model.add(Dense(1))
    return model

  def preprocessing(self):
    data = self.df.filter(['Close'])
    dataset = data.values
    training_data_len = int(np.ceil(len(dataset))*0.95)

    scaler = MinMaxScaler(feature_range=(0,1))
    scaled_data = scaler.fit_transform(dataset)

    train_data = scaled_data[0:int(training_data_len), :]
    x_train = []
    y_train = []

    for i in range(60, len(train_data)):
      x_train.append(train_data[i-60:i, 0])
      y_train.append(train_data[i, 0])

    x_train, y_train = np.array(x_train), np.array(y_train)
    x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))

    return x_train, y_train, training_data_len, scaled_data, scaler
  
  def get_pred(self):
    test_data = self.scaled_data[self.training_data_len - 60: , :]
    x_test = []
    y_test = self.df.filter(['Close']).values[self.training_data_len:, :]
    for i in range(60, len(test_data)):
      x_test.append(test_data[i-60:i, 0])

    x_test = np.array(x_test)
    x_test = np.reshape(x_test, (x_test.shape[0], x_test.shape[1], 1 ))

    predictions = self.model.predict(x_test)
    predictions = self.scaler.inverse_transform(predictions)
    return predictions

  def get_pred_graph(self):
    data = self.df.filter(['Close'])
    train = data[:self.training_data_len]
    valid = data[self.training_data_len:]
    valid.loc[:, 'Predictions'] = self.predictions
    plt.figure(figsize=(16,6))
    plt.title('Model')
    plt.xlabel('Date', fontsize=18)
    plt.ylabel('Close Price USD ($)', fontsize=18)
    plt.plot(train['Close'])
    plt.plot(valid[['Predictions']])
    plt.legend(['Train','Predictions'], loc='lower right')

    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    
    # Clear the plot for reuse
    plt.clf()

    return buffer