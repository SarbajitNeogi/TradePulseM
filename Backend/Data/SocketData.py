import json
import random
import re
import string

import requests
from websocket import create_connection
from tradingview_ta import TA_Handler, Interval, Exchange


class real_time_data:
    def __init__(self, symbol: str, price: float, change: float, change_percentage: float, volume: str):
        self.symbol = symbol
        self.price = price
        self.change = change
        self.change_percentage = change_percentage
        self.volume = volume

    def get_price(self):
        return self.price
    
    def __str__(self):
        return f'Symbol : {self.symbol}, Price : {self.price}, Volume : {self.volume}, Change : {self.change}, Change Percentage : {self.change_percentage}'

received_data = real_time_data('', 0, 0, 0, '')

def search(query, category):
    url = f"https://symbol-search.tradingview.com/symbol_search/?text={query}&type={category}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        assert len(data) != 0, "Nothing Found."
        return data[0]
    else:
        print("Network Error!")
        exit(1)


def generate_session():
    string_length = 12
    letters = string.ascii_lowercase
    random_string = "".join(random.choice(letters) for _ in range(string_length))
    return "qs_" + random_string


def prepend_header(content):
    return f"~m~{len(content)}~m~{content}"


def construct_message(func, param_list):
    return json.dumps({"m": func, "p": param_list}, separators=(",", ":"))


def create_message(func, param_list):
    return prepend_header(construct_message(func, param_list))


def send_message(ws, func, args):
    ws.send(create_message(func, args))


# Send a ping packet
def send_ping_packet(ws, result):
    ping_str = re.findall(".......(.*)", result)
    if ping_str:
        ping_str = ping_str[0]
        ws.send(f"~m~{len(ping_str)}~m~{ping_str}")


def socket_job(ws):
    while True:
        try:
            result = ws.recv()
            if "quote_completed" in result or "session_id" in result:
                continue
            res = re.findall("^.*?({.*)$", result)
            if res:
                json_res = json.loads(res[0])
                if json_res["m"] == "qsd":
                    prefix = json_res["p"][1]
                    symbol = prefix["n"]
                    price = prefix["v"].get("lp", 'Same')
                    volume = prefix["v"].get("volume", None)
                    change = prefix["v"].get("ch", None)
                    change_percentage = prefix["v"].get("chp", None)

                    global received_data
                    received_data = real_time_data(symbol, price, volume, change, change_percentage)

                    break  # Terminate the loop after processing a single message
            else:
                send_ping_packet(ws, result)
        except KeyboardInterrupt:
            exit(0)
        except Exception as e:
            print(f"ERROR: {e}\nTradingView message: {result}")
            continue

# Get symbol ID based on pair and market
def get_symbol_id(pair, market):
    data = search(pair, market)
    symbol_name = data["symbol"]
    broker = data.get("prefix", data["exchange"])
    symbol_id = f"{broker.upper()}:{symbol_name.upper()}"
    return symbol_id


# Main function to establish WebSocket connection and start job
def main(pair, market):
    symbol_id = get_symbol_id(pair, market)

    trading_view_socket = "wss://data.tradingview.com/socket.io/websocket"
    headers = json.dumps({"Origin": "https://data.tradingview.com"})
    ws = create_connection(trading_view_socket, headers=headers)
    session = generate_session()

    send_message(ws, "quote_create_session", [session])
    send_message(
        ws,
        "quote_set_fields",
        [
            session,
            "lp",
            "volume",
            "ch",
            "chp",
        ],
    )
    send_message(ws, "quote_add_symbols", [session, symbol_id])

    socket_job(ws)

def fetch_socket_data(symbol, market):
    main(symbol, market)
    return received_data.get_price()

if __name__ == "__main__":
    pair = "AAPL"
    market = "STOCK"

    main(pair, market)
    print(received_data)