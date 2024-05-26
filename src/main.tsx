import React, {useState} from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import  AboutPage from './Pages/AboutPage.tsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css'
import { ProfileInterface } from './Constants/interfaces.ts';
import ErrorPage from './Components/ErrorPage.tsx';
import TradingPage from './Pages/TradingPage.tsx';
import AuthForm from './Pages/AuthForm.tsx';
import MyProfile from './Components/MyProfile.tsx';
import TradeList from './Components/TradeList.tsx';
import SymbolComponent from './Components/SymbolComponent.tsx';

function AppWithRouter() {
  const [isSigned, setIsSigned] = useState(false);
  const [user, setUser] = useState<ProfileInterface>({
    _id : '',
    name : 'Profile',
    email : '',
    balance : 0,
    balancesheet : [],
    activities : []
  });


  const router = createBrowserRouter([
    {
      path: '/',
      element: <App isSigned={isSigned} user={user}/>,
    },
    {
      path: '/trade',
      element: <TradingPage isSigned={isSigned} user={user}/>
    },
    {
      path: '/about',
      element: <AboutPage isSigned={isSigned} user={user}/>
    },
    {
      path: '/signin',
      element: <AuthForm type={false} setIsSigned={setIsSigned} setUser={setUser}/>
    },
    {
      path: '/signup',
      element: <AuthForm type={true} setIsSigned={setIsSigned} setUser={setUser}/>
    },
    {
      path: '/trade/about',
      element: <AboutPage isSigned={isSigned} user={user}/>
    },
    {
      path: '/profile',
      element: <MyProfile isSigned={isSigned} user={user}/>
    },
    {
      path: '/:country',
      element: <TradeList isSigned={isSigned} user={user}/>
    },
    {
      path: '/trade/:country',
      element: <TradeList isSigned={isSigned} user={user}/>
    },
    {
      path: '/trade/:country/:market',
      element: <TradeList isSigned={isSigned} user={user}/>
    },
    {
      path: '/symbols/:symbol',
      element: <SymbolComponent isSigned={isSigned} user={user} setUser={setUser}/>
    },
    {
      path: '*',
      element: <ErrorPage />
    }
  ]);

  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<AppWithRouter />);
