import React from 'react';
import './Modal.css';
import Button from '../Button/Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, message,}) => {

  if (!isOpen) return null;

  const handleConfirm = () => {
      onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <h2 className="modal__title">{message}</h2>
        <div className='modal__button'>
          <Button
            text={''}
            variant='close'
            icon='close'
            onClick={handleConfirm}
          />
        </div>
      </div>
    </div>
  );
};

export default Modal;
