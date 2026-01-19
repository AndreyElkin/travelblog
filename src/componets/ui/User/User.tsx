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

  const handleUserClick = () => {
    setIsOpen(!isOpen);
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/account');
    setIsOpen(false);
  };

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(logoutUser());
    setIsOpen(false);
    navigate('/');
  };

  return (
    <div className='user' onClick={handleUserClick}>
      <img className='user__image' src={image} alt={name} />
      <span className='user__name'>{name}</span>
      <div className='user__arrow'>
        <img src={isOpen ? DropButtonUp : DropButtonDown} alt="drop-button" />
      </div>
      {isOpen && (
        <div className='user__dropdown' onClick={(e) => e.stopPropagation()}>
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