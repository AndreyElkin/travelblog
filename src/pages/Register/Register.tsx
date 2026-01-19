import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import Input from '../../componets/ui/Input/Input';
import Button from '../../componets/ui/Button/Button';
import Modal from '../../componets/ui/Modal/Modal';
import './Register.page.css';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { registerUser, clearError } from '../../store/slices/authSlice';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, validationErrors } = useAppSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [localValidationErrors, setLocalValidationErrors] = useState<{
    email?: string;
    password?: string;
    passwordConfirmation?: string;
  }>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const errors: typeof localValidationErrors = {};

    if (!email) {
      errors.email = 'Email обязателен';
    } else if (!validateEmail(email)) {
      errors.email = 'Некорректный email';
    }

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

    setLocalValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Получаем ошибки валидации из API
  const getFieldError = (fieldName: string): string => {
    // Сначала проверяем локальные ошибки валидации
    if (localValidationErrors[fieldName as keyof typeof localValidationErrors]) {
      return localValidationErrors[fieldName as keyof typeof localValidationErrors] || '';
    }
    // Затем проверяем ошибки из API
    if (validationErrors?.[fieldName]) {
      const apiErrors = validationErrors[fieldName];
      if (Array.isArray(apiErrors)) {
        return apiErrors[0] || '';
      }
      return String(apiErrors);
    }
    // Проверяем альтернативные названия полей
    if (fieldName === 'password_confirmation' && validationErrors?.['password.confirmation']) {
      const apiErrors = validationErrors['password.confirmation'];
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

    const result = await dispatch(
      registerUser({
        email,
        password,
        password_confirmation: passwordConfirmation,
      })
    );

    if (registerUser.fulfilled.match(result)) {
      setIsModalOpen(true);
    }
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    navigate('/login');
  };


  return (
    <section className="register">
      <h2 className='register__title'>Регистрация</h2>
      <form className='register__form' onSubmit={handleSubmit}>
        <Input 
          label="Email" 
          placeholder="Email"
          required={true}
          errorMessage={getFieldError('email')}
          width="100%"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (localValidationErrors.email) {
              setLocalValidationErrors({ ...localValidationErrors, email: undefined });
            }
          }}
          type="email"
          name="email"
          autoComplete="email"
        />
        <div className='register__passwordblock'>
          <Input 
            label="Пароль"
            type='password' 
            placeholder="Введите пароль"
            required={true}
            errorMessage={getFieldError('password')}
            width="100%"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (localValidationErrors.password) {
                setLocalValidationErrors({ ...localValidationErrors, password: undefined });
              }
            }}
            name="password"
            autoComplete="new-password"
          />
          <Input 
            label="Подтверждение пароля"
            type='password' 
            placeholder="Подтвердите пароль"
            required={true}
            errorMessage={getFieldError('password_confirmation')}
            width="100%"
            value={passwordConfirmation}
            onChange={(e) => {
              setPasswordConfirmation(e.target.value);
              if (localValidationErrors.passwordConfirmation) {
                setLocalValidationErrors({ ...localValidationErrors, passwordConfirmation: undefined });
              }
            }}
            name="password_confirmation"
            autoComplete="new-password"
          />
        </div>
        <Button 
          text={isLoading ? "Регистрация..." : "Зарегистрироваться"} 
          width="234px" 
          variant="primary" 
          type="submit"
        />
      </form>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Регистрация успешна"
        message="Вы успешно зарегистрировались! Теперь вы можете войти в систему."
        type="success"
        confirmText="ОК"
        onConfirm={handleModalConfirm}
      />
    </section>
  );
};

export default Register;

