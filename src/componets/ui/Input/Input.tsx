import React from 'react';
import './Input.css';

interface InputProps {
  label: string;
  placeholder?: string;
  errorMessage?: string;
  width?: string;
  margin?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  name?: string;
  autoComplete?: string;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  placeholder, 
  errorMessage, 
  width = '100%',
  margin,
  required = false,
  value,
  onChange,
  type = 'text',
  name,
  autoComplete
}) => {
  const hasError = !!errorMessage;
  const inputId = `input-${name || Math.random().toString(36).substr(2, 9)}`;

  const isControlled = value !== undefined && onChange !== undefined;

  return (
    <div className='input__wrapper' style={{ width, margin }}>
      <label className='input__label' htmlFor={inputId}>
        {required && <span className='input__required'>*</span>}
        {label}
      </label>
      {isControlled ? (
        <input
          id={inputId}
          className={`input ${hasError ? 'input--error' : ''}`}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          autoComplete={autoComplete}
        />
      ) : (
        <input
          id={inputId}
          className={`input ${hasError ? 'input--error' : ''}`}
          type={type}
          placeholder={placeholder}
          defaultValue={value}
          name={name}
          autoComplete={autoComplete}
        />
      )}
      {errorMessage && (
        <span className='input__error-message'>{errorMessage}</span>
      )}
    </div>
  );
};

export default Input;
