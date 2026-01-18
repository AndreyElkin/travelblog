import { useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router'
import Layout from './componets/Layout/Layout'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Account from './pages/Account/Account'
import AccountEdit from './pages/AccountEdit/AccountEdit'
import Story from './pages/Story/Story'
import Create from './pages/Create/Create'
import Review from './pages/Review/Review'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { fetchCurrentUser } from './store/slices/authSlice'

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    // Если есть токен, но нет пользователя - загружаем данные
    if (token && !user && !isLoading) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, user, isLoading]);

  useEffect(() => {
    // Если пользователь авторизован, но данных нет - перенаправляем на редактирование
    if (isAuthenticated && !user && !isLoading && location.pathname !== '/account/edit') {
      navigate('/account/edit');
    }
  }, [isAuthenticated, user, isLoading, navigate, location.pathname]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
        <Route path="/account/edit" element={<AccountEdit />} />
        <Route path="/story/:id" element={<Story />} />
        <Route path="/story/create" element={<Create />} />
        <Route path="/story/review" element={<Review />} />
      </Routes>
    </Layout>
  )
}

export default App