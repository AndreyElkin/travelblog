import React, { useState } from 'react';
import './Review.page.css';
import Input from '../../componets/ui/Input/Input';
import Button from '../../componets/ui/Button/Button';
import TextArea from '../../componets/ui/TextArea/TextArea';
import Modal from '../../componets/ui/Modal/Modal';

const Review: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = () => {
    setIsModalOpen(true);
  };

  return (
    <section className='review container'>
      <h2 className='review__title'>Добавление отзыва</h2>
      <form className='review__form'>
        <Input label='Ваше имя' placeholder='Введите имя' required={true} errorMessage='' width='100%' value='' />

        <TextArea label='Ваш отзыв' placeholder='Добавьте текст отзыва' required={true} errorMessage='dddd' value='0' maxLength={600} />

        <div className='review__buttonblock'>        
          <Button text='Назад' width='145px' variant='outline' icon='arrow-left'/>
          <Button text='Отправить' width='150px' variant='primary' onClick={handleSubmit}/>
        </div>
      </form>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Спасибо!"
        message="Ваш отзыв успешно отправлен."
        type="success"
        confirmText="ОК"
        onConfirm={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default Review;