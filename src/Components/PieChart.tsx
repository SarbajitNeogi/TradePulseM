import React, { useEffect, useState } from 'react';
import './PieChart.css';
import ErrorBox from './ErrorBox';

interface Data {
    Buy : number,
    Sell : number,
    Hold : number
}

const PieChart: React.FC<{ symbol: string }> = ({ symbol }) => {
    const [interval_value, setinterval] = useState<number>(900000);
    const [error, setError] = useState<string>('');
    const [data, setData] = useState<Data>({Buy: 0, Sell: 0, Hold: 0});

    const triggerError = (err:string) => {
        setError(err);
    };
      const closeErrorBox = () => {
        setError('');
    };

    const handleInterval = (e:React.ChangeEvent<HTMLSelectElement>) => {
        const {value} = e.target;
        setinterval(Number(value))
        fetchData();
    }

  const fetchData = async () => {
    try {
        const request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                symbol : symbol,
                interval : interval_value
            }),
        };
      const response = await fetch('http://127.0.0.1:5000/suggestion', request);
      const responseData: Data = await response.json();

      setData(responseData);
    } catch (error:{message:string}) {
      console.error('Error fetching data:', error);
      triggerError(error.message);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, interval_value);
    return () => clearInterval(interval);
  }, [symbol]);

  return (
    <div className="pie-chart-container">
        {error && <ErrorBox errorMessage={error} onClose={closeErrorBox} />}
        <div className="chart-header">
            <div className="chart-title">
                Prediction for {symbol}
            </div>
            <div className="chart-duration">
                <select value={interval_value} onChange={handleInterval}>
                    <option value="300000">5 Minutes</option>
                    <option value="900000">15 Minutes</option>
                    <option value="1800000">30 Minutes</option>
                    <option value="3600000">1 Hour</option>
                    <option value="14400000">4 Hours</option>
                    <option value="86400000">1 Day</option>
                </select>
            </div>
        </div>
      <div className="predict-chart">
        <div className="pie-chart"
            style={{background: `conic-gradient(
                green 0% ${data.Buy}%,
                #ffce56 ${data.Buy}% ${data.Buy+data.Hold}%,
                red ${data.Buy+data.Hold}% 100%
            )`}}
            >
        </div>
        <div className="chart-value">
            <div className="buy-value">
                Buy : {data.Buy.toFixed(2)}%
            </div>
            <div className="buy-value">
                Hold : {data.Hold.toFixed(2)}%
            </div>
            <div className="buy-value">
                Sell : {data.Sell.toFixed(2)}%
            </div>
        </div>
      </div>
    </div>
  );
};

export default PieChart;
