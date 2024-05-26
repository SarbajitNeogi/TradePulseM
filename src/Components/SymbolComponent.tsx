import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SymbolDataInterface, ProfileInterface } from '../Constants/interfaces';
import NavBar from './NavBar';
import Footer from './Footer';
import './SymbolComponent.css';
import AdvancedChart from './AdvancedChart';
import { TradeCategories } from '../Constants/Items';
import PaperTrading from './PaperTrading';
import PieChart from './PieChart';
import PlotComponent from './PlotComponent';
import Notify from './Notify';

interface SymbolComponentProps {
  isSigned: boolean;
  user: ProfileInterface;
  setUser: Function
}

const SymbolComponent: React.FC<SymbolComponentProps> = (props) => {
  const { symbol } = useParams<{ symbol: string }>();
  const [symbolData, setSymbolData] = useState<SymbolDataInterface>({
    symbol: '',
    screener: '',
    exchange: '',
    company_name: '',
    market: '',
    path: ''
  });
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [oldPrice, setoldPrice] = useState<number>(0);
  const [priceChangePercentage, setPriceChangePercentage] = useState<number>(100);
  const [about, SetAbout] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [signal, setSignal] = useState<string>("");
  const [buy_price, setBuy] = useState<number>(currentPrice);
  const [notify, setNotify] = useState<string | null>(null);

  const prevIsSignedIn = useRef<boolean>(props.isSigned);
  const nav = useNavigate();

  const closeNotify = () => {
    setNotify(null);
  };
  const triggerNotify = (err:string) => {
    setNotify(err);
  };

  useEffect(() => {
    if (symbolData.symbol == 'BTCUSD'){
      fetch('http://127.0.0.1:5000/get_signal', {
      method: "POST",
      body: JSON.stringify({
        buy_price: buy_price,
        current_price: currentPrice
      }),
       
      headers: {
        'Content-Type': 'application/json',
      }
      }).then (res => res.json())
      .then (data=> {
        setSignal(data.signal);
        if (signal == 'BUY'){
          triggerNotify('BTC-USD Buy Signal found');
        }else if (signal == 'SELL'){
          triggerNotify('BTC-USD Sell Signal found');
        }
      }).catch(e => console.log(e))
    }
  }, [currentPrice])
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/data?screener=&exchange=&search=${symbol}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch symbol data');
        }
        const data: SymbolDataInterface[] = await response.json();
        setSymbolData(data[0]);
      } catch (error) {
        console.error('Error fetching symbol data:', error);
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      // Cleanup tasks if needed
    };
  }, [symbol]);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const priceResponse = await fetch(`http://localhost:5000/price/${symbolData?.symbol}`);
        if (!priceResponse.ok) {
          throw new Error('Failed to fetch current price data');
        }
        const priceData = await priceResponse.json();
        setCurrentPrice(priceData.price);
        let changePercentage = ((priceData.price - oldPrice) / oldPrice) % 100
        setPriceChangePercentage(changePercentage);

        setoldPrice(priceData.price);
        SetAbout(priceData.about);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching current price data:', error);
        setLoading(false);
      }
    };

    const priceInterval = setInterval(fetchPrice, 10000);

    // Cleanup function
    return () => clearInterval(priceInterval);
  }, [symbolData]);

  useEffect(() => {
    if (!prevIsSignedIn.current && !props.isSigned) {
      nav('/signin');
    }
    prevIsSignedIn.current = props.isSigned;
  }, [props.isSigned, nav]);

  return (
    <div className='symbol-component-page'>
      <NavBar
        isSigned={props.isSigned}
        profile_name={props.isSigned ? props.user.name : 'Profile'}
      />
      {notify && <Notify Message={notify} onClose={closeNotify}/>}
      {loading ? (
        <div className="loader-wrapper">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className='symbol-page'>
          <div className="symbol-page-header">
            {symbolData && (
              <>
                <img src={TradeCategories.find(category => category.path.includes(symbolData.market))?.icon} alt="" />
                <div className="symbol-title">
                  <div className="symbol-title-head">{symbolData.company_name}</div>
                  <div>{symbolData.exchange}:{symbolData.symbol}</div>
                </div>
              </>
            )}
          </div>
          <div className="symbol-price-box">
            <div className="price-box">
              <div className="price-head upper-flow">PRICE</div>
              <div className="price-content">Rs. {currentPrice.toFixed(2)}</div>
            </div>
            {priceChangePercentage == Number(NaN) ?
              <div>Calculating</div>
              :
              <div className={`price-change-box ${priceChangePercentage > 0 ? 'up' : 'down'}`}>
                <div className="change-content">{priceChangePercentage}%</div>
                <div className="price-change">{priceChangePercentage > 0 ? 'UP' : 'DOWN'}</div>
              </div>
            }
          </div>
          <div className="advanced-chart">
            <AdvancedChart symbol={`${symbolData?.exchange}:${symbolData?.symbol}`} />
          </div>
          <div className="symbol-info">
            <div className='upper-flow'>{symbolData?.symbol} ({symbolData?.market}) : {symbolData?.exchange}</div>
            <div>{about}</div>
          </div>
          <div className="trading-center-box">
            <div className='upper-flow'>Trading Section</div>
            <div>
              <div>
                <div>
                  <div className="balance-box">
                    <div className="balance-box-title">Your Balance</div>
                    <input type="text" value={props.user.balance} readOnly />
                  </div>
                  <div className="balance-box">
                    <div className="balance-box-title">Current Price</div>
                    <input type="text" value={currentPrice} readOnly />
                  </div>
                </div>
                <div>
                  <PaperTrading
                    currentPrice={currentPrice}
                    user={props.user}
                    setUser={props.setUser}
                    symbolData={symbolData}
                    setBuy={setBuy}/>
                </div>
              </div>
              <div className="suggestion">
                <PieChart symbol={symbolData.symbol} />
              </div>
            </div>
          </div>
          <div className="view-plot">
            <div className="view-plot1">
            <div className="upper-flow">
              Algorithm Trading
            </div>
            <div className="view-plot-component">
              <PlotComponent symbol={symbolData.symbol} />
            </div>
            </div>
            <div className="view-plot2">
              <div className="plot-heading">
                Intraday Signal
              </div>
              <div className="boxes">
                <div className={`box ${signal == 'BUY'? 'green': ''}`}></div>
                <div className={`box ${signal == 'SELL'? 'red': ''}`}></div>
                <div className={`box ${signal == 'EXIT'? 'violet': ''}`}></div>
                <div className={`box ${signal == 'HOLD'? 'yellow': ''}`}></div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default SymbolComponent;