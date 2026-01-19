import React from 'react';
import { Link } from 'react-router';
import './Header.css';
import logoImage from '../../assets/images/logo-travel.png';
import photoUserDefault from '../../assets/images/photo-user-1.jpg';
import User from '../ui/User/User';
import { useAppSelector } from '../../store/hooks';
import type { RootState } from '../../store/store';

const Header: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state: RootState) => state.auth);

  return (
    <header className='header container'>
      <Link className='header__logo' to="/">
        <img src={logoImage} alt="logo"/>
      </Link>
      <div className='header__user'>
        {!isAuthenticated ? (
          <Link className='header__user-link' to="/login">Войти</Link>
        ) : user ? (
          <User 
            name={user.full_name} 
            image={
              user.photo 
                ? (user.photo.startsWith('http') ? user.photo : `https://travelblog.skillbox.cc${user.photo}`)
                : photoUserDefault
            } 
          />
        ) : null}
      </div>
    </header>
  );
};

export default Header;

