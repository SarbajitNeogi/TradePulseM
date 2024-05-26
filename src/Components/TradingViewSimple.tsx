import React, { useEffect, useRef, memo } from 'react';

const TradingViewSimple: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "symbols": [
          [
            "Apple",
            "AAPL|1D|INR"
          ],
          [
            "Google",
            "GOOGL|1D|INR"
          ],
          [
            "Microsoft",
            "MSFT|1D|INR"
          ],
          [
            "CRYPTO:BTCUSD|1D|INR"
          ],
          [
            "BSE:SENSEX|1D|INR"
          ]
        ],
        "chartOnly": false,
        "width": "100%",
        "height": "100%",
        "locale": "en",
        "colorTheme": "light",
        "autosize": true,
        "showVolume": false,
        "showMA": false,
        "hideDateRanges": false,
        "hideMarketStatus": false,
        "hideSymbolLogo": false,
        "scalePosition": "right",
        "scaleMode": "Normal",
        "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
        "fontSize": "10",
        "noTimeScale": false,
        "valuesTracking": "1",
        "changeMode": "price-and-percent",
        "chartType": "area",
        "maLineColor": "#2962FF",
        "maLineWidth": 1,
        "maLength": 9,
        "backgroundColor": "rgba(255, 255, 255, 0)",
        "lineWidth": 2,
        "lineType": 0,
        "dateRanges": [
          "1d|1",
          "1m|30",
          "3m|60",
          "12m|1D",
          "60m|1W",
          "all|1M"
        ],
        "dateFormat": "dd-MM-yyyy"
      }`;
      
    if (container.current) {
      container.current.appendChild(script);
    }

    return () => {
      // Cleanup script when the component is unmounted
      if (container.current) {
        container.current.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="tradingview-widget-container" ref={container}>
    </div>
  );
};

export default memo(TradingViewSimple);
