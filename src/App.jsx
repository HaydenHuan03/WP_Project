import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import boardsSlices from './redux/boardSlice';
import EmptyBoard from './components/EmptyBoard';
import LoginSignIn from './LoginScreen/LoginPage';
import MainPage from './LoginScreen/MainPage';

function App() {
  const dispatch = useDispatch();
  const boards = useSelector((state) => state.boards);
  const activeBoard = boards.find(board => board.isActive);

  if (!activeBoard && boards.length > 0) {
    dispatch(boardsSlices.actions.setBoardActive({ index: 0 }));
  }

  return (
    <div className='scrollbar-hide overflow-hidden overflow-x-scroll'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginSignIn />} />
          {/* <Route path='/signup' element={<SignupPage/>}></Route> */}
          {boards.length > 0 ? (
            <Route path='/main' element={<MainPage />} />
          ) : (
            <Route path='/emptyBoard' element={<EmptyBoard type='add' />} />
          )}
        </Routes>
      </BrowserRouter>        

    </div>
  );
}

export default App;
