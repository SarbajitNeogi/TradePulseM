import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import { ProfileInterface } from '../Constants/interfaces';
import { SymbolDataInterface } from '../Constants/interfaces';
import { useNavigate, useParams } from 'react-router-dom';
import './TradeList.css';

interface PropsInterface {
  isSigned: boolean;
  user: ProfileInterface;
}


function TradeList(props: PropsInterface) {
  const navigate = useNavigate();
  const { country, market } = useParams();
  const [filters, setFilters] = useState<{ [key: string]: string }>({
    screener: country?.toUpperCase() || '',
    exchange: '',
    market: market || '',
  });
  const [searchInput, setSearchInput] = useState('');
  const [data, setData] = useState<SymbolDataInterface[]>([]);

  useEffect(() => {
    fetchData();
  }, [filters, searchInput]);

  const fetchData = async () => {
    try {
      const url = `http://localhost:5000/data?${new URLSearchParams({
        ...filters,
        search: searchInput,
      })}`;

      const response = await fetch(url);
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  return (
    <>
      <NavBar
        isSigned={props.isSigned}
        profile_name={props.isSigned ? props.user.name : 'Profile'}
      />
      <div className="trade-list-page">
        <div className="search-box">
          <input type="text" value={searchInput} onChange={handleSearchInputChange} placeholder='Search your favourite symbol...' />
          <button onClick={fetchData}>Search</button>
        </div>
        <div className="filter-area">
          <select name="screener" value={filters.screener} onChange={handleFilterChange}>
            <option value="">Select Screener</option>
            <option value="INDIA">India</option>
            <option value="AMERICA">United States</option>
            <option value="UK">United Kingdom</option>
            {/* Populate options dynamically */}
          </select>
          <select name="exchange" value={filters.exchange} onChange={handleFilterChange}>
            <option value="">Select Exchange</option>
            <option value="NSE">NSE</option>
            <option value="BSE">BSE</option>
            <option value="NASDAQ">NASDAQ</option>
            {/* Populate options dynamically */}
          </select>
          <select name="market" value={filters.market} onChange={handleFilterChange}>
          <option value="">Select Exchange</option>
            <option value="index">Indices</option>
            <option value="stock">Stocks</option>
            <option value="option">Options</option>
            <option value="crypto">Crypto</option>
            {/* Populate options dynamically */}
          </select>
        </div>

        <div className="data-list">
          {data.map((item) => (
            <div key={item.symbol} className="data-item" onClick={()=>navigate(`/symbols/${item.symbol}`)}>
              <p>{item.symbol}</p>
              <p>{item.company_name}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default TradeList;
