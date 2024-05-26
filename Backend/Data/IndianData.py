import requests
from bs4 import BeautifulSoup

url = 'indian-indices/bank-nifty-23.html'


def getIndianData (path:str) :
    response = requests.get('https://www.moneycontrol.com/'+path)
    soup = BeautifulSoup(response.text, "html.parser")

    class1 = 'pcstkspr nsestkcp bsestkcp futstkcp optstkcp'
    return float(soup.find(class_=class1).text.replace(",", ""))

print(getIndianData('/india/stockpricequote/computers-software/tataconsultancyservices/TCS'))