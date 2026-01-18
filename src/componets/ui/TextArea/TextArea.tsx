import React from 'react';
import './TextArea.css';

interface TextAreaProps {
  label: string;
  placeholder?: string;
  required?: boolean;
  errorMessage?: string;
  value: string;
  maxLength?: number;
}

const TextArea: React.FC<TextAreaProps> = ({ label, placeholder, required, errorMessage, value, maxLength }) => {
  const hasError = !!errorMessage;
  return (
    <label className='textarea__label'>
    <div className='textarea__label-title'>
      <span className='textarea__label-required'>{required ? '*' : ''}</span>
      <span className='textarea__label-text'>{label}</span>
    </div>
    <textarea 
      className={`textarea__textarea ${hasError ? 'textarea--error' : ''}`} 
      name="postContent" 
      rows={4} 
      cols={40} 
      required={required} 
      placeholder={placeholder}/>
    <div className='textarea__errorblock'>
      <span className='textarea__error'>{errorMessage}</span>
      <span className='textarea__counter'>{value.length} / {maxLength}</span>
    </div>
  </label>
);
};

export default TextArea;