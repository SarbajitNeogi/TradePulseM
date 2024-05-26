import {useState} from "react"
import { Link } from "react-router-dom"
import { LinkInterface } from "../Constants/interfaces"
import {NavItems} from "../Constants/Items"
import './Navbar.css'

interface propInterface {
    isSigned : boolean,
    profile_name : string
}

function NavBar(props:propInterface) {
    const [showNav, setShowNav] = useState<boolean> (false);


  return (
    <nav className="navbar">
        <Link to='/'>
        <img src="/Logo.png" alt="TradePulse" />
        </Link>
        <button className="nav-menu" onClick={()=>setShowNav(!showNav)}>
            <i className="material-icons">menu</i>
        </button>

        <ul className={showNav ? 'nav-config show' : 'nav-config'}>
            {
                NavItems.map((item:LinkInterface) => (
                    <li key={item.id}>
                        <Link to={item.path}>{item.title}</Link>
                    </li>
                ))
            }
            {
                props.isSigned ? (
                    <li id="profile">
                        <Link to='/profile'>
                            {props.profile_name}
                        </Link>
                    </li>
                ) : (
                    <>
                    <li id='signin'>
                        <Link to='/signin'>Signin</Link>
                     </li>
                      <li id='signup'>
                       <Link to='/signup'>Signup</Link>
                     </li>
                     </>
                )
            }
            
        </ul>

    </nav>
  )
}

export default NavBar