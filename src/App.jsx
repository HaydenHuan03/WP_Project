import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import boardsSlices, { fetchBoards } from './redux/boardSlice';
import EmptyBoard from './components/EmptyBoard';
import LoginSignIn from './LoginScreen/LoginPage';
import SignupPage from './LoginScreen/SignupPage';
import MainPage from './LoginScreen/MainPage';

function App() {
  const dispatch = useDispatch();
  const boards = useSelector((state) => state.boards);
  const isLoading = useSelector((state) => state.isLoading); 

  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch])

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
          <Route path='/main' element={shouldRenderMainPage ? <MainPage /> : <EmptyBoard/>}/>
        </Routes>
      </BrowserRouter>        

    </div>
  );
}

export default App;
