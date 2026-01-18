import React from 'react';
import { useNavigate } from 'react-router';
import './Account.page.css';
import photoUser from '../../assets/images/photo-user-1.jpg';
import Button from '../../componets/ui/Button/Button';

const Account: React.FC = () => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate('/account/edit');
  };

  return (
    <section className="account">
        <div className="account__photo">
          <img src={photoUser} alt="photo" />
          <Button text="Изменить фото" width="auto" variant="link" icon="camera" />
        </div>
        <div className="account__info">
          <div className="account__info-item">
            <h2 className="account__name">Боярская Варвара Михайловна</h2>
            <Button text='' width='auto' variant='img' icon='edit' onClick={handleEditClick}></Button>
            </div>
          <span className="account__cyty">Город:</span>
          <span className="account__city-value">Вышний Волочёк</span>
          <span className="account__about">О себе:</span>
          <p className="account__about-description">
            Я обожаю путешествовать. Мне нравится открывать для себя новые места, 
            знакомиться с разными культурами и традициями. 
            Я всегда готова отправиться в путь, даже если это означает покинуть зону комфорта. 
            В дороге я встречаю новых людей, учусь новому и наслаждаюсь красотами природы. 
            Путешествия дают мне возможность расширить свой кругозор и узнать больше о мире вокруг меня. 
            Я уверена, что каждый новый опыт делает меня сильнее и мудрее.
          </p>
        </div>
    </section>
  );
};

export default Account;

