import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import  { fetchBoards } from './redux/boardSlice';
import EmptyBoard from './components/EmptyBoard';
import LoginSignIn from './LoginScreen/LoginPage';
import SignupPage from './LoginScreen/SignupPage';
import MainPage from './LoginScreen/MainPage';
import ProtectedRoute from './route/ProtectedRoute';
import userSlice from './redux/userSlice';
import { logoutUser } from './redux/userSlice';

function App() {
  const dispatch = useDispatch();
  const boards = useSelector((state) => state.boards);
  const isLoading = useSelector((state) => state.isLoading); 


  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch])

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        dispatch(userSlice.actions.setUserFromLocalStorage(JSON.parse(storedUser)));
    }
    dispatch(fetchBoards());
}, [dispatch]);

  useEffect(() => {
    const handleNavigation = () => {
        localStorage.clear();
        dispatch(logoutUser());
    };

    window.addEventListener('popstate', handleNavigation);

    return () => {
        window.removeEventListener('popstate', handleNavigation);
    };
  }, [dispatch]);

  // If boards are loading, you might want to show a loading spinner or message
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Determine which route to render based on boards state
  const shouldRenderMainPage = boards.length > 0;

  return (
    <div className=' select-none overflow-hidden overflow-x-scroll'>
      <BrowserRouter>
      
        <Routes>
          <Route path='/' element={<LoginSignIn />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/main' element={<ProtectedRoute>{shouldRenderMainPage ? <MainPage /> : <EmptyBoard/>}</ProtectedRoute>}/>
        </Routes>
      </BrowserRouter>        

    </div>
  );
}

export default App;
