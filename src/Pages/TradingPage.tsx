// import React from 'react'
import NavBar from '../Components/NavBar'
import Footer from '../Components/Footer'
import TradeComponent from '../Components/TradeComponent'
import { ProfileInterface } from '../Constants/interfaces'

interface propsInterface {
  isSigned : boolean
  user : ProfileInterface
}

function TradingPage(props:propsInterface) {
  return (
    <>
    <NavBar isSigned={props.isSigned} profile_name={props.isSigned ? props.user.name : 'Profile'}/>
    <TradeComponent/>
    <Footer/>
    
    </>
  )
}

export default TradingPage