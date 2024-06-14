import React, { useState } from 'react';
import Header from '../components/Header';
import Center from '../components/Center';

const MainPage = () => {
  const [boardModalOpen, setBoardModalOpen] = useState(false);

  return (
    <>
      <Header boardModalOpen={boardModalOpen} setBoardModalOpen={setBoardModalOpen} />
      <Center boardModalOpen={boardModalOpen} setBoardModalOpen={setBoardModalOpen} />
    </>
  );
};

export default MainPage;
