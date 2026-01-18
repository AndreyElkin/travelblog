import React, { useState } from 'react';
import './Create.page.css';
import Input from '../../componets/ui/Input/Input';
import Button from '../../componets/ui/Button/Button';
import TextArea from '../../componets/ui/TextArea/TextArea';
import Modal from '../../componets/ui/Modal/Modal';


const Create: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = () => {
    setIsModalOpen(true);
  };

  return (
    <section className="create">
      <h2 className='create__title'>Добавление истории о путешествии</h2>
      <form className='create__form'>

        <Button 
          text='Загрузите ваше фото'
          variant='upload'
          icon='upload'
          width='200px'
        />

        <Input
          label='Заголовок'
          placeholder='Заголовок'
          required={true}
          type='text'
          name='title'
          margin='30px 0 0 0'
        />
        <div className='create__input-block'>
        <Input
          label='Страна'
          placeholder='Страна'
          required={true}
          type='text'
          name='country'
        />

        <Input
          label='Город'
          placeholder='Город'
          required={true}
          type='text'
          name='city'
        />
        </div>
        <TextArea 
          label='Описание' 
          placeholder='Добавьте описание вашей истории' 
          required={true} 
          value='0' 
          maxLength={2000} />

        <div className='create__button-block'>
          <Button text='Назад' width='145px' variant='outline' icon='arrow-left'/>
          <Button text='Сохранить' width='150px' variant='primary' onClick={handleSave}/>
        </div>

      </form>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message="Ваша история успешно добавлена"
      />
    </section>
  );
};

export default Create;

