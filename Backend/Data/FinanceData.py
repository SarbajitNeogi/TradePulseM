import requests
from bs4 import BeautifulSoup



def getFinanceData (path:str) :
    response = requests.get('https://www.google.com/finance/quote/'+path)
    soup = BeautifulSoup(response.text, "html.parser")

    about_class = 'bLLb2d'
    price_class = 'YMlKec fxKbKc'

    try :
       about = soup.find(class_=about_class).text
    except:
       about = 'No description found'

    
    try :
        price = float(soup.find(class_=price_class).text.replace(',', ''))
    except:
        price = float(soup.find(class_=price_class).text[1:].replace(',', ''))
        currency = soup.find(class_=price_class).text.strip()[0]

        if currency == '$':
            price = round(price*83.5, 2)
        elif currency == '₹':
            price = round(price, 2)
    if path == 'BTC-USD':
        price = round(price*83.5, 2)

    return ({
        'about' : about,
        'price' : price
    })

# print(getFinanceData('NIFTY_50:INDEXNSE'))