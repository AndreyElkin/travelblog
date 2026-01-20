import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import type { FormEvent } from 'react';
import './Review.page.css';
import Input from '../../componets/ui/Input/Input';
import Button from '../../componets/ui/Button/Button';
import TextArea from '../../componets/ui/TextArea/TextArea';
import Modal from '../../componets/ui/Modal/Modal';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createComment, clearError, fetchComments } from '../../store/slices/postSlice';

const Review: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const postId = searchParams.get('postId');
  const { isLoading, validationErrors, commentSuccess } = useAppSelector((state) => state.post);
  const { user } = useAppSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState(user?.full_name || '');
  const [text, setText] = useState('');
  const [localError, setLocalError] = useState<{ name?: string; text?: string }>({});

  useEffect(() => {
    if (!postId) {
      navigate('/');
    }
  }, [postId, navigate]);

  useEffect(() => {
    if (commentSuccess && postId) {
      setIsModalOpen(true);
      dispatch(clearError());
      // Обновляем комментарии после успешного создания
      const id = parseInt(postId, 10);
      if (!isNaN(id)) {
        dispatch(fetchComments(id));
      }
    }
  }, [commentSuccess, dispatch, postId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    dispatch(clearError());
    setLocalError({});

    const errors: { name?: string; text?: string } = {};

    if (!name || !name.trim()) {
      errors.name = 'Имя обязательно';
    } else if (name.length > 255) {
      errors.name = 'Имя не должно превышать 255 символов';
    }

    if (!text || !text.trim()) {
      errors.text = 'Текст отзыва обязателен';
    } else if (text.length > 600) {
      errors.text = 'Текст отзыва не должен превышать 600 символов';
    }

    if (Object.keys(errors).length > 0) {
      setLocalError(errors);
      return;
    }

    if (postId) {
      const id = parseInt(postId, 10);
      if (!isNaN(id)) {
        await dispatch(createComment({
          postId: id,
          comment: text.trim(),
          full_name: name.trim(),
        }));
      }
    }
  };

  const handleBack = () => {
    if (postId) {
      navigate(`/story/${postId}`);
    } else {
      navigate('/');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (postId) {
      navigate(`/story/${postId}`);
    } else {
      navigate('/');
    }
  };

  const getFieldError = (fieldName: string): string => {
    // Сначала проверяем локальные ошибки
    if (localError[fieldName as keyof typeof localError]) {
      return localError[fieldName as keyof typeof localError] || '';
    }
    
    // Затем проверяем ошибки из API
    if (validationErrors) {
      // Проверяем прямое совпадение
      if (validationErrors[fieldName]) {
        const apiErrors = validationErrors[fieldName];
        if (Array.isArray(apiErrors)) {
          return apiErrors[0] || '';
        }
        return String(apiErrors);
      }
      
      // Проверяем альтернативные названия полей
      // API возвращает ошибки для полей 'comment' и 'full_name'
      const alternativeFields: Record<string, string[]> = {
        'text': ['text', 'comment_text', 'comment'],
        'name': ['name', 'full_name', 'comment_name', 'author_name'],
      };
      
      if (alternativeFields[fieldName]) {
        for (const altField of alternativeFields[fieldName]) {
          if (validationErrors[altField]) {
            const apiErrors = validationErrors[altField];
            if (Array.isArray(apiErrors)) {
              return apiErrors[0] || '';
            }
            return String(apiErrors);
          }
        }
      }
    }
    
    return '';
  };

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setLocalError((prev) => {
      if (prev.name) {
        const { name, ...rest } = prev;
        return rest;
      }
      return prev;
    });
  }, []);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setLocalError((prev) => {
      if (prev.text) {
        const { text, ...rest } = prev;
        return rest;
      }
      return prev;
    });
  }, []);

  if (!postId) {
    return null;
  }

  return (
    <section className='review container'>
      <h2 className='review__title'>Добавление отзыва</h2>
      <form className='review__form' onSubmit={handleSubmit} noValidate>
        <Input 
          label='Ваше имя' 
          placeholder='Введите имя' 
          required={true} 
          errorMessage={getFieldError('name')} 
          width='100%' 
          value={name}
          onChange={handleNameChange}
          autoComplete="name"
          name="name"
        />

        <TextArea 
          label='Ваш отзыв' 
          placeholder='Добавьте текст отзыва' 
          required={true} 
          errorMessage={getFieldError('text')} 
          value={text} 
          maxLength={600}
          onChange={handleTextChange}
          name="text"
        />

        <div className='review__buttonblock'>        
          <Button 
            text='Назад' 
            width='145px' 
            variant='outline' 
            icon='arrow-left'
            onClick={handleBack}
            type="button"
          />
          <Button 
            text={isLoading ? 'Отправка...' : 'Отправить'} 
            width='150px' 
            variant='primary' 
            type="submit"
          />
        </div>
      </form>
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        message="Ваш отзыв успешно отправлен."
      />
    </section>
  );
};

export default Review;