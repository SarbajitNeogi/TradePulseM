from tradingview_ta import TA_Handler, Interval, Exchange

def get_prediction(symbol_value:str, screener_value:str, exchange_value:str, interval_value:int):
    if interval_value == 300000:
        interval_class = Interval.INTERVAL_5_MINUTES
    elif interval_value == 900000:
        interval_class = Interval.INTERVAL_15_MINUTES
    elif interval_value == 1800000:
        interval_class = Interval.INTERVAL_30_MINUTES
    elif interval_value == 3600000:
        interval_class = Interval.INTERVAL_1_HOUR
    elif interval_value == 14400000:
        interval_class = Interval.INTERVAL_4_HOURS
    elif interval_value == 86400000:
        interval_class = Interval.INTERVAL_1_DAY

    pred = TA_Handler (
        symbol=symbol_value,
        screener=screener_value,
        exchange=exchange_value,
        interval=interval_class
    )

    buy = pred.get_analysis().summary.get('BUY')
    sell = pred.get_analysis().summary.get('SELL')
    hold = pred.get_analysis().summary.get('NEUTRAL')

    total = buy + sell + hold

    buy_percentage = (buy/total)*100
    sell_percentage = (sell/total)*100
    hold_percentage = (hold/total)*100

    return ({
        'Buy' : buy_percentage,
        'Sell' : sell_percentage,
        'Hold' : hold_percentage
    })


# print(get_prediction (symbol_value='SBIN', screener_value='INDIA', exchange_value='NSE', interval_value=3600000))