import React from 'react';
import './TextArea.css';

interface TextAreaProps {
  label: string;
  placeholder?: string;
  required?: boolean;
  errorMessage?: string;
  value: string;
  maxLength?: number;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  name?: string;
}

const TextArea: React.FC<TextAreaProps> = ({ 
  label, 
  placeholder, 
  required, 
  errorMessage, 
  value, 
  maxLength,
  onChange,
  name
}) => {
  const hasError = !!errorMessage;
  const isControlled = value !== undefined && onChange !== undefined;
  
  return (
    <label className='textarea__label'>
    <div className='textarea__label-title'>
      <span className='textarea__label-required'>{required ? '*' : ''}</span>
      <span className='textarea__label-text'>{label}</span>
    </div>
    {isControlled ? (
      <textarea 
        className={`textarea__textarea ${hasError ? 'textarea--error' : ''}`} 
        name={name || "postContent"} 
        rows={4} 
        cols={40} 
        required={required} 
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
      />
    ) : (
      <textarea 
        className={`textarea__textarea ${hasError ? 'textarea--error' : ''}`} 
        name={name || "postContent"} 
        rows={4} 
        cols={40} 
        required={required} 
        placeholder={placeholder}
        defaultValue={value}
        maxLength={maxLength}
      />
    )}
    <div className='textarea__errorblock'>
      <span className='textarea__error'>{errorMessage}</span>
      {maxLength && <span className='textarea__counter'>{value.length} / {maxLength}</span>}
    </div>
  </label>
);
};

export default TextArea;