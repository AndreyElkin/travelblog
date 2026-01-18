import React from 'react';
import './AccountEdit.page.css';
import photoUser from '../../assets/images/photo-user-1.jpg';
import Button from '../../componets/ui/Button/Button';
import Input from '../../componets/ui/Input/Input';
import TextArea from '../../componets/ui/TextArea/TextArea';



const AccountEdit: React.FC = () => {
  return (
<section className="account-edit">
        <div className="account-edit__photo">
          <img src={photoUser} alt="photo" />
          <Button text="Изменить фото" width="auto" variant="link" icon="camera" />
        </div>
        <div className="account-edit__info">
          <form className="account-edit__form">
            <Input label='ФИО' required={true}/>
            <Input label='Город' required={true}/>
            <TextArea label='О себе' required={true} value='' maxLength={600}/>
            <span className='account-edit__title'>Смена пароля</span>

            <div className='account-edit__password-block'>
              <Input label='Новый пароль' placeholder='Новый пароль' required={true}/>
              <Input label='Повторите пароль' placeholder='Повторите пароль' required={true}/>
            </div>
            <div className='account-edit__button-block'>
              <Button text='Назад' variant='outline' width='111px'/>
              <Button text='Сохранить' variant='primary' width='150px'/>
            </div>              
          </form>
        </div>
    </section>  );
};

export default AccountEdit;
