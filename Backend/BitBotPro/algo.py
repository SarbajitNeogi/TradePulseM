import math

import ccxt
import pandas as pd


open_ = 65920.99
close = 65880.42
high = 65938.68
low = 65758.46
prev_open = 65817.52
prev_close = 65920.97

# Initialize the exchange
exchange = ccxt.coinbasepro()  # Using Coinbase Pro exchange

# Set the symbol and timeframe
symbol = 'BTC/USD'
timeframe = '1h'

try:
    # Fetch OHLCV (Open, High, Low, Close, Volume) data
    ohlcv = exchange.fetch_ohlcv(symbol, timeframe)

    # Convert the fetched data to a pandas DataFrame
    df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
    df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')  # Convert timestamp to datetime

    # Extracting open, close, high, low of each 1-hour candle
    opens = df['open'].values
    closes = df['close'].values
    highs = df['high'].values
    lows = df['low'].values

    open_ = opens[-1]
    close = closes[-1]
    high = highs[-1]
    low = lows[-1]
    prev_open = opens[-2]
    prev_close = closes[len(closes)-2]


except ccxt.NetworkError as e:
    print('Network error:', e)
except ccxt.ExchangeError as e:
    print('Exchange error:', e)
except Exception as e:
    print('Error in data:', e)


#------------------------------------------------------------------------------------------
def find_33_level(price):
    upper_bound=(((((math.floor(price)//1000))+1)*1000)+33)
    lower_bound=upper_bound-1000
    return lower_bound, upper_bound

def find_absolute_value(x):
    return abs(x)

def btc_entry(current_price, open_, close, high, low, prev_open, prev_close):
    lower_bound, upper_bound = find_33_level(current_price)
    if open_ < upper_bound and close < upper_bound and open_ > lower_bound and close > lower_bound:
        if high >= upper_bound and find_absolute_value(prev_open - prev_close) < 1000:
            buy_price = current_price
            return ("BUY")

        elif low <= lower_bound and find_absolute_value(prev_open - prev_close) < 1000:
            buy_price = current_price
            btc_exit(False, buy_price, close, open_, current_price)
            return ("SELL")

def btc_exit(X, buy_price, close, open_, price):
    exit_price = None
    if X == 1:
        tp = buy_price + 1000
        sl = buy_price - 500
        if close > tp:
            tp1 = tp
            tp = tp + 1000
            if open_ > tp and close < tp:
                exit_price = exit_price
                profit=exit_price-buy_price
                print("Exit with profit : ",profit )
            elif close > tp:
                tp1 = tp
                tp = tp + 1000
                if price >= tp:
                    
                    exit_price = price
                    profit=exit_price-buy_price
                    print("Exit with profit : ",profit )
                elif price<=tp1:
                    # EXIT
                    exit_price = price
                    profit=exit_price-buy_price
                    print("Exit with profit : ",profit )
        if price <= sl:
            # EXIT
            exit_price = price
            loss=exit_price-buy_price
            print("Exit with profit : ",loss )

    if X == 0:
        tp = buy_price - 1000
        sl = buy_price + 500
        if close < tp:
            tp1 = tp
            tp = tp - 1000
            if open_ < tp and close > tp:
                # EXIT
                exit_price = price
                profit=exit_price-buy_price
                print("Exit with profit : ",profit )
            elif close < tp:
                tp1=tp
                tp = tp - 1000
                if price <= tp:
                    # EXIT
                    exit_price = price
                    profit=exit_price-buy_price
                    print("Exit with profit : ",profit )
                elif price>=tp1:
                    # EXIT
                    exit_price = price
                    profit=exit_price-buy_price
                    print("Exit with profit : ",profit )
        if price >= sl:
            # EXIT
            exit_price = price
            loss=buy_price - price
            print("Exit with profit : ",loss )

# Example usage
current_price = 67145

buy_price=0


def get_bit_algo(current_price, buy_price):
    if(btc_entry(current_price, open_, close, high, low, prev_open, prev_close))=="BUY":
        btc_exit(True, buy_price, close, open_, current_price)
        return("BUY")

    elif(btc_entry(current_price, open_, close, high, low, prev_open, prev_close))=="SELL":
        btc_exit(False, buy_price, close, open_, current_price)
        return("SELL")
    else:
        return('HOLD')

print(get_bit_algo(current_price, buy_price))