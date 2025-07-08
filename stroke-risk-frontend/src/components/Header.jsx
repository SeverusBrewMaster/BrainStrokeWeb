import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <div className="container navbar">
        <div className="logo">
          <img src="/images/Strokelogo.png" alt="StrokeCare Logo" />
          BrainLine
        </div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/risk">Riskometer</Link></li>
          <li><Link to="#">Help</Link></li>
        </ul>
        <div className="profile-dropdown">
          <Link to="/user">
            <img src="/images/user.png" alt="Profile Picture" className="profile-icon" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;