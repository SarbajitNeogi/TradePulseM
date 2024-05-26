import React, { useState } from 'react';
import LineGraph from './Linegraph';

interface PlotComponentProps {
    symbol:string
}

const PlotComponent: React.FC<PlotComponentProps> = ({symbol}) => {
  const [plotData, setPlotData] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [buttonClicked, setButtonClicked] = useState<boolean>(false);

  const fetchData = () => {
    setIsLoading(true);
    fetch(`http://localhost:5000/predict_lstm/${symbol}`)
      .then(response => response.json())
      .then(data => {
        const rev = data.predictions.reverse();
        setPlotData(rev);
        setIsLoading(false);
        setButtonClicked(true);
      })
      .catch(error => {
        console.error('Error fetching plot data:', error);
        setIsLoading(false);
      });
  };

  return (
    <div>
        <div className="plot-heading">
            Long Term Prediction
        </div>
      {!buttonClicked && <button onClick={fetchData}>{isLoading ? 'Loading...' : 'Calculate'}</button>}
      {plotData.length > 0 && (
        <div className='plot-graph-pred'>
          <LineGraph data={plotData}/>
        </div>
      )}
    </div>
  );
};

export default PlotComponent;
