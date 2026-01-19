import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import type { FormEvent } from 'react';
import './Create.page.css';
import Input from '../../componets/ui/Input/Input';
import Button from '../../componets/ui/Button/Button';
import TextArea from '../../componets/ui/TextArea/TextArea';
import Modal from '../../componets/ui/Modal/Modal';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createPost, clearError } from '../../store/slices/postsSlice';

const Create: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, validationErrors, createSuccess } = useAppSelector((state) => state.posts);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [localValidationErrors, setLocalValidationErrors] = useState<{
    title?: string;
    description?: string;
    country?: string;
    city?: string;
    photo?: string;
  }>({});

  useEffect(() => {
    if (createSuccess) {
      setIsModalOpen(true);
      dispatch(clearError());
    }
  }, [createSuccess, dispatch]);


  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Проверка типа файла
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setLocalValidationErrors({
          ...localValidationErrors,
          photo: 'Фото должно быть в формате JPEG или PNG',
        });
        return;
      }

      setPhoto(file);
      setLocalValidationErrors({
        ...localValidationErrors,
        photo: undefined,
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoPreview('');
    setLocalValidationErrors({
      ...localValidationErrors,
      photo: undefined,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  const getFieldError = (fieldName: string): string => {
    // Сначала проверяем локальные ошибки валидации
    const localError = localValidationErrors[fieldName as keyof typeof localValidationErrors];
    if (localError) {
      return localError;
    }
    
    // Затем проверяем ошибки из API
    if (validationErrors?.[fieldName]) {
      const apiErrors = validationErrors[fieldName];
      if (Array.isArray(apiErrors)) {
        return apiErrors[0] || '';
      }
      return String(apiErrors);
    }
    
    return '';
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    dispatch(clearError());

    // Валидация всех полей
    const errors: {
      title?: string;
      description?: string;
      country?: string;
      city?: string;
      photo?: string;
    } = {};

    if (!title || !title.trim()) {
      errors.title = 'Заголовок обязателен';
    } else if (title.length > 255) {
      errors.title = 'Заголовок не должен превышать 255 символов';
    }

    if (!description || !description.trim()) {
      errors.description = 'Описание обязательно';
    } else if (description.length > 2000) {
      errors.description = 'Описание не должно превышать 2000 символов';
    }

    if (!country || !country.trim()) {
      errors.country = 'Страна обязательна';
    } else if (country.length > 255) {
      errors.country = 'Страна не должна превышать 255 символов';
    }

    if (!city || !city.trim()) {
      errors.city = 'Город обязателен';
    } else if (city.length > 255) {
      errors.city = 'Город не должен превышать 255 символов';
    }

    if (!photo) {
      errors.photo = 'Фото обязательно';
    }

    if (Object.keys(errors).length > 0) {
      setLocalValidationErrors(errors);
      // Прокручиваем к первой ошибке после обновления DOM
      setTimeout(() => {
        const firstErrorField = Object.keys(errors)[0];
        let errorElement: HTMLElement | null = null;
        
        // Для textarea используем name="description"
        if (firstErrorField === 'description') {
          errorElement = document.querySelector('textarea[name="description"]') as HTMLElement;
        } else {
          errorElement = document.querySelector(`input[name="${firstErrorField}"]`) as HTMLElement;
        }
        
        if (errorElement) {
          errorElement.focus();
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 0);
      return;
    }

    await dispatch(createPost({
      title: title.trim(),
      description: description.trim(),
      country: country.trim(),
      city: city.trim(),
      photo: photo!,
    }));
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate('/');
  };

  return (
    <section className="create">
      <h2 className='create__title'>Добавление истории о путешествии</h2>
      <form className='create__form' onSubmit={handleSubmit} noValidate>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          style={{ display: 'none' }}
          onChange={handlePhotoChange}
        />
        {!photo && (
          <Button 
            text='Загрузите ваше фото'
            variant='upload'
            icon='upload'
            width='200px'
            onClick={handlePhotoButtonClick}
            type="button"
          />
        )}
        {photoPreview && (
          <div style={{ position: 'relative', display: 'inline-block', marginTop: photo ? '0' : '10px' }}>
            <img 
              src={photoPreview} 
              alt="Preview" 
              style={{ 
                maxWidth: '200px', 
                maxHeight: '200px', 
                objectFit: 'cover',
                borderRadius: '8px',
                display: 'block'
              }} 
            />
            <button
              type="button"
              onClick={handleRemovePhoto}
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                background: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 'bold'
              }}
              title="Удалить фото"
            >
              ×
            </button>
          </div>
        )}
        {getFieldError('photo') && (
          <span style={{ color: 'red', fontSize: '12px', display: 'block', marginTop: '5px' }}>
            {getFieldError('photo')}
          </span>
        )}

        <Input
          label='Заголовок'
          placeholder='Заголовок'
          required={true}
          type='text'
          name='title'
          margin='30px 0 0 0'
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (localValidationErrors.title) {
              setLocalValidationErrors({ ...localValidationErrors, title: undefined });
            }
          }}
          errorMessage={getFieldError('title')}
          width="100%"
        />
        <div className='create__input-block'>
          <Input
            label='Страна'
            placeholder='Страна'
            required={true}
            type='text'
            name='country'
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              if (localValidationErrors.country) {
                setLocalValidationErrors({ ...localValidationErrors, country: undefined });
              }
            }}
            errorMessage={getFieldError('country')}
            width="100%"
          />

          <Input
            label='Город'
            placeholder='Город'
            required={true}
            type='text'
            name='city'
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              if (localValidationErrors.city) {
                setLocalValidationErrors({ ...localValidationErrors, city: undefined });
              }
            }}
            errorMessage={getFieldError('city')}
            width="100%"
          />
        </div>
        <TextArea 
          label='Описание' 
          placeholder='Добавьте описание вашей истории' 
          required={true} 
          value={description} 
          maxLength={2000}
          name="description"
          onChange={(e) => {
            setDescription(e.target.value);
            if (localValidationErrors.description) {
              setLocalValidationErrors({ ...localValidationErrors, description: undefined });
            }
          }}
          errorMessage={getFieldError('description')}
        />

        <div className='create__button-block'>
          <Button 
            text='Назад' 
            width='145px' 
            variant='outline' 
            icon='arrow-left'
            onClick={handleBack}
            type="button"
          />
          <Button 
            text={isLoading ? 'Сохранение...' : 'Сохранить'} 
            width='150px' 
            variant='primary' 
            type="submit"
          />
        </div>
      </form>
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        message="Ваша история успешно добавлена"
      />
    </section>
  );
};

export default Create;

