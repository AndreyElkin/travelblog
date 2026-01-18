import React from 'react';
import './Comment.css';

interface CommentProps {
  name: string;
  date: string;
  text: string;
}

const Comment: React.FC<CommentProps> = ({ name, date, text }) => {
  return (
    <div className='comment'>
      <span className='comment__name'>{name}</span>
      <span className='comment__date'>{date}</span>
      <p className='comment__text'>{text}</p>
    </div>
  );
};

export default Comment;