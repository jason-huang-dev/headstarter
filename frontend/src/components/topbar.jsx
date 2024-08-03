import { useState } from 'react'
import './topbar.css'
import { Link } from 'react-router-dom';

function Topbar() {


  return (
    <>
      {/* =============== TOPBAR MENU =============== */}
        <div className="topbar-menu" id="topbar-menu">
            <ul className="topbar-list">
                <li className='home-link'><Link to="/">Home</Link></li>
                <div className='right-items'>
                    <li><Link to="/whentomeet">When to Meet</Link></li>
                    <li><Link to="/signin">Sign In</Link></li>
                    <li><Link to="/start" className="start-button">Start</Link></li>
                </div>
            </ul>
        </div>
      
    </>
  )
}

export default Topbar