import NavBar from './Components/NavBar'
import TradingViewWidget from './Components/TradingViewSimple'
import TopStories from './Components/TopStories'
import TradeComponent from './Components/TradeComponent'
import Footer from './Components/Footer'
import { Link } from 'react-router-dom'
import { ProfileInterface } from './Constants/interfaces'
import './App.css'
import LineGraph from './Components/Linegraph'

interface propsInterface {
  isSigned : boolean,
  user : ProfileInterface
}

function App(props:propsInterface) {
  return (
    <>
    <NavBar isSigned={props.isSigned} profile_name={props.isSigned ? props.user.name : 'Profile'}/>
    <div className={`home-charts ${props.isSigned ? 'signed' : 'not-signed'}`}>
      <div className="hero-chart">
        <TradingViewWidget/>
      </div>
      {props.isSigned && (
        <div className="profile-card">
          <div className="profile-card-heading">Profile</div>
          <div className="profile-graph">
          <LineGraph data={props.user.balancesheet}/>
          </div>
          <div className="profile-card-bal-title">Rs. {props.user.balance.toFixed(2)}/-</div>
          <div className="profile-card-name">{props.user.name}</div>
          <Link to='/profile'>View</Link>
        </div>
      )}
      <div className="side-hero">
        <TopStories/>
      </div>
    </div>
    <TradeComponent/>
    <Footer/>
    </>
  )
}

export default App
