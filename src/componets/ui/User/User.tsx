import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import './User.css';
import DropButtonUp from '../../../assets/images/DropButtonUp.svg';
import DropButtonDown from '../../../assets/images/DropButtonDown.svg';
import { useAppDispatch } from '../../../store/hooks';
import { logoutUser } from '../../../store/slices/authSlice';

interface UserProps {
  name: string;
  image: string;
}

const User: React.FC<UserProps> = ({ name, image }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleProfileClick = () => {
    navigate('/account');
    setIsOpen(false);
  };

  const handleLogoutClick = () => {
    dispatch(logoutUser());
    setIsOpen(false);
    navigate('/');
  };

  return (
    <div className='user'>
      <img className='user__image' src={image} alt={name} />
      <span className='user__name'>{name}</span>
      <button className='user__button' onClick={handleButtonClick}>
        <img src={isOpen ? DropButtonUp : DropButtonDown} alt="drop-button" />
      </button>
      {isOpen && (
        <div className='user__dropdown'>
          <button className='user__dropdown-button' onClick={handleProfileClick}>
            Профиль
          </button>
          <button className='user__dropdown-button' onClick={handleLogoutClick}>
            Выйти
          </button>
        </div>
      )}
    </div>
  );
};

export default User;