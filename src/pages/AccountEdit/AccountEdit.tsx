import { useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router';
import './AccountEdit.page.css';
import photoUser from '../../assets/images/photo-user-1.jpg';
import Button from '../../componets/ui/Button/Button';
import Input from '../../componets/ui/Input/Input';
import TextArea from '../../componets/ui/TextArea/TextArea';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateUserProfile, updateUserPassword, fetchUserProfile, clearError } from '../../store/slices/profileSlice';
import { updateUserData } from '../../store/slices/authSlice';

const AccountEdit: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isLoading, validationErrors, updateSuccess } = useAppSelector((state) => state.profile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [about, setAbout] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  
  const [localValidationErrors, setLocalValidationErrors] = useState<{
    name?: string;
    password?: string;
    passwordConfirmation?: string;
  }>({});

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setName(user.full_name || '');
      setCity(user.city || '');
      setAbout(user.bio || '');
      if (user.photo) {
        setAvatarPreview(user.photo.startsWith('http') ? user.photo : `https://travelblog.skillbox.cc${user.photo}`);
      }
    }
  }, [user]);

  useEffect(() => {
    if (updateSuccess && user) {
      // Обновляем данные пользователя в auth slice
      dispatch(updateUserData(user));
      dispatch(clearError());
      navigate('/account');
    }
  }, [updateSuccess, user, navigate, dispatch]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarButtonClick = () => {
    fileInputRef.current?.click();
  };

  const validateForm = (): boolean => {
    const errors: typeof localValidationErrors = {};

    if (!name.trim()) {
      errors.name = 'ФИО обязательно';
    }

    if (password || passwordConfirmation) {
      if (!password) {
        errors.password = 'Пароль обязателен';
      } else if (password.length < 6) {
        errors.password = 'Пароль должен быть не менее 6 символов';
      }

      if (!passwordConfirmation) {
        errors.passwordConfirmation = 'Подтверждение пароля обязательно';
      } else if (password !== passwordConfirmation) {
        errors.passwordConfirmation = 'Пароли не совпадают';
      }
    }

    setLocalValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getFieldError = (fieldName: string): string => {
    if (localValidationErrors[fieldName as keyof typeof localValidationErrors]) {
      return localValidationErrors[fieldName as keyof typeof localValidationErrors] || '';
    }
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
    dispatch(clearError());
    setLocalValidationErrors({});

    if (!validateForm()) {
      return;
    }

    // Обновление профиля
    const profileData: any = {
      full_name: name.trim(),
    };
    if (city.trim()) profileData.city = city.trim();
    if (about.trim()) profileData.bio = about.trim();
    if (avatar) profileData.photo = avatar;

    await dispatch(updateUserProfile(profileData));

    // Обновление пароля (если заполнено)
    if (password && passwordConfirmation) {
      await dispatch(updateUserPassword({
        password,
        password_confirmation: passwordConfirmation,
      }));
    }
  };

  const handleBack = () => {
    navigate('/account');
  };

  return (
    <section className="account-edit">
      <div className="account-edit__photo">
        <img src={avatarPreview || photoUser} alt="photo" />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleAvatarChange}
        />
        <Button 
          text="Изменить фото" 
          width="auto" 
          variant="link" 
          icon="camera" 
          onClick={handleAvatarButtonClick}
        />
      </div>
      <div className="account-edit__info">
        <form className="account-edit__form" onSubmit={handleSubmit}>
          <Input 
            label='ФИО' 
            required={true}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (localValidationErrors.name) {
                setLocalValidationErrors({ ...localValidationErrors, name: undefined });
              }
            }}
            errorMessage={getFieldError('name')}
            width="100%"
            autoComplete="name"
            name="name"
          />
          <Input 
            label='Город' 
            required={false}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            errorMessage={getFieldError('city')}
            width="100%"
            autoComplete="address-level2"
            name="city"
          />
          <TextArea 
            label='О себе' 
            required={false} 
            value={about} 
            maxLength={600}
            onChange={(e) => setAbout(e.target.value)}
            errorMessage={getFieldError('about')}
          />
          <span className='account-edit__title'>Смена пароля</span>

          <div className='account-edit__password-block'>
            <Input 
              label='Новый пароль' 
              placeholder='Новый пароль' 
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (localValidationErrors.password) {
                  setLocalValidationErrors({ ...localValidationErrors, password: undefined });
                }
              }}
              errorMessage={getFieldError('password')}
              width="100%"
              autoComplete="new-password"
              name="password"
            />
            <Input 
              label='Повторите пароль' 
              placeholder='Повторите пароль' 
              type="password"
              value={passwordConfirmation}
              onChange={(e) => {
                setPasswordConfirmation(e.target.value);
                if (localValidationErrors.passwordConfirmation) {
                  setLocalValidationErrors({ ...localValidationErrors, passwordConfirmation: undefined });
                }
              }}
              errorMessage={getFieldError('password_confirmation')}
              width="100%"
              autoComplete="new-password"
              name="password_confirmation"
            />
          </div>
          <div className='account-edit__button-block'>
            <Button 
              text='Назад' 
              variant='outline' 
              width='111px'
              onClick={handleBack}
              type="button"
            />
            <Button 
              text={isLoading ? 'Сохранение...' : 'Сохранить'} 
              variant='primary' 
              width='150px'
              type="submit"
            />
          </div>              
        </form>
      </div>
    </section>
  );
};

export default AccountEdit;
