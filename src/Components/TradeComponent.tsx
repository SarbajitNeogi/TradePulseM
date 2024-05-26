import React from 'react'
import { Countries, TradeCategories } from '../Constants/Items'
import './TradeComponent.css'
import { Link } from 'react-router-dom'
import { BsArrowUpRightCircleFill } from "react-icons/bs";

const TradeComponent:React.FC = () => {
  return (
    <div className="trade">
      <h1>Countries</h1>
        <div className="countries">
          {
            Countries.map(item=>(
              <div key={item.id}>
                <div className="heading">
                  <div className="trade-icon">
                    <img src={item.flag} alt="" />
                  </div>
                  <div className="trade-title">
                    {item.name}
                  </div>
                </div>
                <div className="content">
                  eg. {item.example}
                </div>
                <Link to = {item.path}>
                  <button>View Details</button>
                </Link>
                
              </div>
            ))
          }
        </div>
        <h1>Invest /  Trade on Stock Exchanges</h1>
        <div className="trade-catogory">
          {
            TradeCategories.map(item => (
              <div key={item.id}>
                <div className="heading">
                  <div className="trade-icon">
                    <img src={item.icon} alt="" />
                  </div>
                  <div className="trade-title">
                    {item.title}
                  </div>
                  <Link to={item.path}>
                    <BsArrowUpRightCircleFill />
                  </Link>
                </div>

              </div>
            ))
          }

        </div>
    </div>
  )
}

export default TradeComponent