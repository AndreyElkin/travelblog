import React from 'react';
import './Button.css';

interface ButtonProps {
  text: string;
  width?: string;
  variant: 'primary' | 'outline' | 'link' | 'img' | 'upload' | 'close';
  icon?: 'arrow-left' | 'camera' | 'edit' | 'upload' | 'close' ;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}
const Button: React.FC<ButtonProps> = ({ text, width, variant, icon, onClick, type = 'button' }) => {
  return (
    <button 
      className={`button button__variant-${variant} ${icon ? `button__${icon}` : ''}`} 
      type={type}
      style={{ width }}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;

