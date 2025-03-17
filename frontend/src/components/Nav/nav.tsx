import React from 'react'
import {Link} from 'react-router-dom'
import './nav.css'

export const Nav:React.FC=() => {
    return(
        <nav className='nav_bar'>
            <div className='nav_item home_button'>
                <Link to="/" className='nav_item_text'>
                    Home
                </Link>
            </div>
            <div className='nav_item leaderboard_button'>
                <Link to="/" className='nav_item_text'>
                    Leaderboard
                </Link>
            </div>
            <div className='nav_item account_button'>
                <Link to="/" className='nav_item_text'>
                    Account
                </Link>
            </div>
        </nav>
    );
}