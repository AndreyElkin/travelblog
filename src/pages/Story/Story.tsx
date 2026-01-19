import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import './Story.page.css';
import storyImage from '../../assets/images/img-story.jpg';
import Comment from '../../componets/ui/Comment/Comment';
import Button from '../../componets/ui/Button/Button';
import Spinner from '../../componets/ui/Spinner/Spinner';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPost, fetchComments, clearPost } from '../../store/slices/postSlice';

const Story: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { post, comments, isLoading, isLoadingComments, error } = useAppSelector((state) => state.post);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      const postId = parseInt(id, 10);
      if (!isNaN(postId)) {
        dispatch(fetchPost(postId));
        dispatch(fetchComments(postId));
      }
    }

    return () => {
      dispatch(clearPost());
    };
  }, [id, dispatch]);

  // Обновляем комментарии при возврате на страницу из Review
  useEffect(() => {
    if (id && location.pathname === `/story/${id}`) {
      const postId = parseInt(id, 10);
      if (!isNaN(postId)) {
        // Небольшая задержка, чтобы убедиться, что комментарий создан на сервере
        const timeout = setTimeout(() => {
          dispatch(fetchComments(postId));
        }, 500);
        return () => clearTimeout(timeout);
      }
    }
  }, [location.pathname, id, dispatch]);

  const handleBack = () => {
    navigate('/');
  };

  const handleShowCommentForm = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (id) {
      navigate(`/story/review?postId=${id}`);
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading && !post) {
    return (
      <section className="story container">
        <Spinner />
      </section>
    );
  }

  if (error && !post) {
    return (
      <section className="story container">
        <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
          <p>Ошибка загрузки поста: {error}</p>
          <Button text="Назад" width="145px" variant="outline" icon="arrow-left" onClick={handleBack} />
        </div>
      </section>
    );
  }

  if (!post) {
    return null;
  }

  const postImage = post.photo 
    ? `https://travelblog.skillbox.cc${post.photo}` 
    : (post.image || storyImage);

  return (
    <section className="story container">
      <img className='story__img' src={postImage} alt={post.title} />
      <div className='story__container'>
        <h1 className='story__title'>{post.title}</h1>
        <p className='story__description'>{post.description || post.excerpt || ''}</p>
        
        {post.userInfo && (
          <div className='story__user-info' style={{ marginTop: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: 600 }}>Автор поста</h3>
            <p style={{ margin: '5px 0', fontSize: '16px' }}><strong>ФИО:</strong> {post.userInfo.full_name}</p>
            {post.userInfo.city && (
              <p style={{ margin: '5px 0', fontSize: '16px' }}><strong>Город:</strong> {post.userInfo.city}</p>
            )}
            {post.userInfo.bio && (
              <p style={{ margin: '5px 0', fontSize: '16px' }}><strong>О себе:</strong> {post.userInfo.bio}</p>
            )}
          </div>
        )}

        <ul className='story__comments-list'>
          {isLoadingComments ? (
            <li key="loading" style={{ listStyle: 'none', width: '100%' }}>
              <Spinner />
            </li>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <li key={comment.id}>
                <Comment 
                  name={comment.name || 'Анонимный пользователь'} 
                  date={formatDate(comment.created_at)} 
                  text={comment.text} 
                />
              </li>
            ))
          ) : (
            <li key="empty" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
              <p>Комментариев пока нет</p>
            </li>
          )}
        </ul>

        <div className='story__button-block'>
          <Button 
            text="Назад" 
            width="145px" 
            variant="outline" 
            icon="arrow-left" 
            onClick={handleBack}
          />
          {isAuthenticated && (
            <Button 
              text="Ваше впечатление об этом месте" 
              width="338px" 
              variant="primary" 
              onClick={handleShowCommentForm}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Story;

