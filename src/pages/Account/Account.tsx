import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import './Account.page.css';
import photoUser from '../../assets/images/photo-user-1.jpg';
import Button from '../../componets/ui/Button/Button';
import Spinner from '../../componets/ui/Spinner/Spinner';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchUserProfile } from '../../store/slices/profileSlice';

const Account: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.profile);
  const authUser = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user && !isLoading) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user, isLoading]);

  const handleEditClick = () => {
    navigate('/account/edit');
  };

  const displayUser = user || authUser;
  const avatarUrl = displayUser?.photo 
    ? (displayUser.photo.startsWith('http') ? displayUser.photo : `https://travelblog.skillbox.cc${displayUser.photo}`)
    : photoUser;

  if (isLoading && !displayUser) {
    return (
      <section className="account">
        <Spinner />
      </section>
    );
  }

  return (
    <section className="account">
        <div className="account__photo">
          <img src={avatarUrl} alt="photo" />
        </div>
        <div className="account__info">
          <div className="account__info-item">
            <h2 className="account__name">{displayUser?.full_name || ''}</h2>
            <Button text='' width='auto' variant='img' icon='edit' onClick={handleEditClick}></Button>
          </div>
          {displayUser?.city && (
            <>
              <span className="account__cyty">Город:</span>
              <span className="account__city-value">{displayUser.city}</span>
            </>
          )}
          {displayUser?.bio && (
            <>
              <span className="account__about">О себе:</span>
              <p className="account__about-description">{displayUser.bio}</p>
            </>
          )}
        </div>
    </section>
  );
};

export default Account;

