import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import CardPost from '../../componets/ui/CardPost/CardPost';
import Button from '../../componets/ui/Button/Button';
import Spinner from '../../componets/ui/Spinner/Spinner';
import './Home.page.css';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPosts } from '../../store/slices/postsSlice';

function Home() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { posts, isLoading, error } = useAppSelector((state) => state.posts);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);


  const handleCreatePost = () => {
    navigate('/story/create');
  };

  const handlePostClick = (postId: number) => {
    navigate(`/story/${postId}`);
  };

  return (
    <section className="home container">
      {isLoading && <Spinner />}
      {error && !isLoading && (
        <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
          <p>Ошибка загрузки постов: {error}</p>
          <p>Попробуйте обновить страницу</p>
        </div>
      )}
      {!isLoading && !error && posts.length > 0 && (
        <>
          <ul className='home__card-list'>
            {posts.map((post) => {
              // Обрабатываем разные форматы полей из API
              const postImage = post.photo 
                ? `https://travelblog.skillbox.cc${post.photo}` 
                : (post.image || '');
              const postDescription = post.excerpt || post.description || '';
              const postCountry = post.county || post.country || '';
              const location = postCountry 
                ? `${postCountry}${post.city ? `, ${post.city}` : ''}`
                : post.city || '';
              
              return (
                <li key={post.id}>
                  <CardPost
                    image={postImage}
                    title={post.title}
                    description={postDescription}
                    country={location}
                    onClick={() => handlePostClick(post.id)}
                  />
                </li>
              );
            })}
          </ul>
          {isAuthenticated && (
            <Button 
              text="Добавить мое путешествие" 
              width="294px" 
              variant="primary"
              onClick={handleCreatePost}
            />
          )}
        </>
      )}
      {!isLoading && !error && posts.length === 0 && (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>Постов пока нет</p>
          {isAuthenticated && (
            <Button 
              text="Добавить мое путешествие" 
              width="294px" 
              variant="primary"
              onClick={handleCreatePost}
            />
          )}
        </div>
      )}
    </section>
  )
}

export default Home
