import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import './Login.page.css';
import Input from '../../componets/ui/Input/Input';
import Button from '../../componets/ui/Button/Button';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser, clearError } from '../../store/slices/authSlice';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, validationErrors } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localErrors, setLocalErrors] = useState<{ email?: string; password?: string }>({});

  const handleRegisterClick = () => {
    dispatch(clearError());
    navigate('/register');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(clearError());
    setLocalErrors({});

    // Базовая валидация на клиенте
    const errors: { email?: string; password?: string } = {};
    if (!email) {
      errors.email = 'Email обязателен';
    }
    if (!password) {
      errors.password = 'Пароль обязателен';
    }

    if (Object.keys(errors).length > 0) {
      setLocalErrors(errors);
      return;
    }

    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      navigate('/');
    }
  };

  const getFieldError = (fieldName: string): string => {
    // Сначала проверяем локальные ошибки
    if (localErrors[fieldName as keyof typeof localErrors]) {
      return localErrors[fieldName as keyof typeof localErrors] || '';
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

  return (
    <section className="login container">
      <h2 className='login__title'>Вход в&nbsp;профиль</h2>
      <form className='login__form' onSubmit={handleSubmit}>
        <Input 
          label="Логин" 
          placeholder="Введите логин"
          required={true}
          errorMessage={getFieldError('email')}
          width="100%"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (localErrors.email) {
              setLocalErrors({ ...localErrors, email: undefined });
            }
          }}
          type="email"
          name="email"
        />
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
            if (localErrors.password) {
              setLocalErrors({ ...localErrors, password: undefined });
            }
          }}
          name="password"
        />
        <div className='login__buttonblock'>
          <Button 
            text="Зарегистрироваться" 
            width="234px" 
            variant="outline" 
            onClick={handleRegisterClick}
            type="button"
          />
          <Button 
            text={isLoading ? "Вход..." : "Войти"} 
            width="113px" 
            variant="primary"
            type="submit"
          />
        </div>
      </form>
    </section>
  );
};

export default Login;

