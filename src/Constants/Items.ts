import { LinkInterface } from "./interfaces"

export const NavItems:Array<LinkInterface> = [
    {
        id : 1,
        title : 'Home',
        path : '/'
    },
    {
        id : 2,
        title : 'Trade',
        path : '/trade'
    },
    {
        id : 3,
        title : "About",
        path : "/about"
    }
]

export const Countries = [
    {
        id : 1, 
        name : 'India',
        flag : 'https://vectorflags.s3.amazonaws.com/flags/in-square-01.png',
        example : 'RELIANCE, TCS, HDFCBANK, INFY, HDFC, ITC, KOTAKBANK, ICICIBANK, LT, SBIN, AXISBANK, M&M, HINDUNILVR, WIPRO, SUNPHARMA, ASIANPAINT, MARUTI, BAJFINANCE, POWERGRID, ULTRACEMCO',
        path : '/trade/india'
    },
    {
        id : 2,
        name : 'United Kingdom',
        flag : 'https://flagdownload.com/wp-content/uploads/Flag_of_United_Kingdom_Flat_Square.png',
        example : 'HSBA, VOD, BP, GSK, RDSA, ULVR, AAL, LLOY, BT, AZN, RIO, DGE, BARC, RBS, GLEN, REL, RDSA, PRU, CRH, MNG, NXT, CCL, WPP, RMV, SMDS, SSE, DCC, UU, AV, NG, IHG',
        path : '/trade/uk'
    },
    {
        id : 3,
        name : 'United States',
        flag : 'https://media.istockphoto.com/id/841938102/vector/united-states-flag-vector-square-flat-icon.jpg?s=612x612&w=0&k=20&c=H6lZzDKiKwjevjvi4bBe9uHkmxotjdae11vkXbocaBU=',
        example : 'AAPL, MSFT, AMZN, GOOGL, TSLA, META, JPM, V, NVDA, JNJ, PYPL, INTC, NFLX, GS, DIS, IBM, BA, XOM, CSCO, PFE',
        path : '/trade/america'
    }

]

export const TradeCategories = [
    {
        id : 1,
        title : "Equities",
        icon : "https://www.pngkey.com/png/full/207-2078991_private-equity-represents-another-interesting-option-private-equity.png",
        path : '/trade/india/stock'
    },
    {
        id : 2,
        title : "Indeces",
        icon : "https://icons.veryicon.com/png/o/business/risk-management/index-4.png",
        path : '/trade/india/index'
    },
    {
        id : 3,
        title : "Options",
        icon : "https://icons.iconarchive.com/icons/dtafalonso/android-l/512/Settings-L-icon.png",
        path : '/trade/india/option'
    },
    {
        id : 4,
        title : "Crypto",
        icon : "https://static-00.iconduck.com/assets.00/generic-cryptocurrency-icon-2048x2029-vzaeox5w.png",
        path : '/trade/india/crypto'
    }
]
