import React, { useState, useEffect } from 'react';
import { ProfileInterface, SymbolDataInterface} from '../Constants/interfaces';
import './PaperTrading.css';
import ErrorBox from './ErrorBox';
import Notify from './Notify';

interface PaperTradingProps {
    user : ProfileInterface
    currentPrice: number
    setUser : Function
    symbolData: SymbolDataInterface
    setBuy: Function
}

const PaperTrading: React.FC<PaperTradingProps> = ({ currentPrice, user, setUser, symbolData , setBuy}) => {
    const sl = (currentPrice*0.95).toFixed(2);
  const [quantity, setQuantity] = useState<number>(0);
  const [stoploss, setStoploss] = useState<number>(Number(sl));
  const [current, setCurrent] = useState<number>(currentPrice);
  const [action, setAction] = useState<'buy' | 'sell'>('buy');
  const [trading, setTrading] = useState<boolean>(false);
  const [profit, setProfit] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [notify, setNotify] = useState<string | null>(null);

  const updateUser = (newBalance: number, activity_value: string) => {
    const newUser:ProfileInterface = {
        _id : user._id,
        name : user.name,
        balance : newBalance,
        email: user.email,
        balancesheet : [...user.balancesheet, newBalance],
        activities: [...user.activities, {time: Date.now(), activity: activity_value}]
    }
    setUser(newUser);
    };


  const closeErrorBox = () => {
    setError(null);
  };
  const triggerError = (err:string) => {
    setError(err);
  };
  const closeNotify = () => {
    setNotify(null);
  };
  const triggerNotify = (err:string) => {
    setNotify(err);
  };

  const handleQuantityInc = () => {
    if (!trading){
      if ((quantity+1)*current > user.balance){
        triggerError ("Insufficient balance")
      }else{
        setQuantity(quantity+1);
      }
    }else{
      triggerError('Unable to change quantity during trading');
    }
  }

  const handleQuantityDec = () => {
    if (!trading){
      if (quantity-1 < 0){
        triggerError("Quantity can't be negetive");
      }else{
        setQuantity(quantity-1);
      }
    }else{
      triggerError('Unable to change quantity during trading');
    }
  }
  
  const handleStopLoss = (e : React.ChangeEvent<HTMLInputElement>)=> {
    const newStoploss = parseFloat(e.target.value);
    setStoploss(newStoploss);
  };

  const handleActionChange = (selectedAction: 'buy' | 'sell') => {
    if (trading == false){
        setAction(selectedAction);
    }else {
        triggerError('Action not allowed');
    }
  };

  const handleUpdateUser = async (email: string, newbalance: number, activity:string) => {
    try {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email : email,
                new_balance : newbalance,
                activity : activity
            }),
        };

        const res = await fetch('http://127.0.0.1:5000/update', requestOptions);
        const data = await res.json();

        if (data.status === 200){
            updateUser(newbalance, activity)
        }
    }catch(err) {
        console.error(err);
        triggerError(err.message);
    }
  }
  
  const handleTrade = () => {
    if (!trading) {
      setTrading(true);
      if (action === 'buy') {
        if (current * quantity > user.balance) {
          triggerError('Insufficient Balance');
          setTrading(false);
        } else {
          setCurrent(currentPrice);
          setBuy(currentPrice);
          
          let newBalance: number = user.balance - (quantity * current);
          handleUpdateUser(
            user.email,
            newBalance,
            `Debited for Buying ${symbolData.symbol} x ${quantity} unit(s) of  Rs. ${
              quantity * current
            } from balance Rs. ${user.balance + quantity * current}`
          );
          triggerNotify('Buy Successfull');
        }
      } else if (action === 'sell') {
        if (current * quantity > user.balance) {
          triggerError('Insufficient Balance');
          setTrading(false);
        } else {
          setCurrent(currentPrice);
          setBuy(currentPrice);
          let newBalance = user.balance - quantity * current;
          handleUpdateUser(
            user.email,
            newBalance,
            `Debited for Selling ${symbolData.symbol} x ${quantity} unit(s) of  Rs. ${
              quantity * current
            } from balance Rs. ${user.balance + -quantity * current}`
          );
          triggerNotify('Sell Successfull');
        }
      }
    } else {
      setTrading(false);
      handleUpdateUser(
        user.email,
        user.balance + profit + quantity * current,
        `Credited profit Rs. ${profit} on exiting ${symbolData.symbol} x ${quantity} unit(s) balance Rs.${user.balance}`
      );
      triggerNotify('Exit Successfull');
      setProfit(0);
    }
  };
  
  useEffect(() => {
    if (action === 'buy' && trading) {
      setProfit(currentPrice - current);
      // if (currentPrice < stoploss){
      //   handleTrade();
      // }
    } else if (action === 'sell' && trading) {
      setProfit(current - currentPrice);
      // if (currentPrice < stoploss){
      //   handleTrade();
      // }
    }
  }, [currentPrice]);

  return (
    <div className="paper-trading-container">
        {error && <ErrorBox errorMessage={error} onClose={closeErrorBox} />}
        {notify && <Notify Message={notify} onClose={closeNotify}/>}
      <div className="trade-form">
        <div className='trade-input-box'>
            <div className='quantity-box'>
                <div className="quantity-heading">
                    Quantity
                </div>
                <div className="quantity-calculate">
                <button
                  onClick={handleQuantityDec}
                >
                  -
                </button>
                <input
                    type="number"
                    value={quantity}
                    placeholder="Quantity"
                    min="0"
                    readOnly
                />
                <button
                  onClick={handleQuantityInc}
                >
                  +
                </button>
                <input type="number" 
                  value={quantity*current}
                  className='show-trade-value'
                  readOnly
                />
                </div>
            </div>
            <div className="profit-box">
                <div className="profit-heading">
                    Profit
                </div>
                <input type="text" 
                    value={profit}
                    readOnly
                />
            </div>
            <div className="stop-loss-box">
                <div className="stop-loss-heading">
                    Stop Loss
                </div>
                <input type="number" 
                value={stoploss}
                onChange={handleStopLoss}
                placeholder='Stop Loss'
                min={0}
                />
            </div>
        </div>
        
        <div className="action-buttons">
          <button onClick={() => handleActionChange('buy')} className={`buy ${action === 'buy' ? 'active' : ''}`}>
            Buy
          </button>
          <button onClick={() => handleActionChange('sell')} className={`sell ${action === 'sell' ? 'active' : ''}`}>
            Sell
          </button>
        </div>
        <button onClick={handleTrade} className="trade-button">
          {trading?'Stop':'Trading'}
        </button>
      </div>
    </div>
  );
};

export default PaperTrading;
