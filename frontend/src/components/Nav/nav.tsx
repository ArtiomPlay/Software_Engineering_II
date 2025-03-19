import React from 'react';
import { NavLink } from 'react-router-dom';
import './nav.css';

export const Nav: React.FC = () => {
    return (
        <nav className='nav_bar'>
            <NavLink to="/" className='nav_link home_button'>
                <div className='nav_item'>
                    Home
                </div>
            </NavLink>
            <NavLink to="/leaderboard" className='nav_link leaderboard_button'>
                <div className='nav_item'>
                    Leaderboard
                </div>
            </NavLink>
            <NavLink to="/account" className='nav_link account_button'>
                <div className='nav_item'>
                    Account
                </div>
            </NavLink>
        </nav>
    );
};