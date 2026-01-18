import React from 'react';
import './CardPost.css';
import type { CardPostProps } from '../../../types/cardPost';

const CardPost: React.FC<CardPostProps> = ({ image, title, description, country, onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    }
  };

  return (

    <article className="card-post">
      <img className='card-post__img' src={image} alt="card-post"/>
      <div className="card-post__content">
        <h2 className="card-post__title">{title}</h2>
        <p className="card-post__description">{description}</p>
        <p className="card-post__country">{country}</p>
        <a href={'#'} className="card-post__link" onClick={handleClick}>Подробнее</a>
      </div>
    </article>
  );
};

export default CardPost;

