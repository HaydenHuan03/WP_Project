import React, {useState}from 'react'
import Header from './components/Header'
import Center from './components/Center'
import { useDispatch, useSelector } from 'react-redux'
import boardsSlices from './redux/boardSlice'
import EmptyBoard from './components/EmptyBoard'

function App(){
  const dispatch = useDispatch()
  const boards = useSelector((state) => state.boards)
  const activeBoard = boards.find(board => board.isActive)

  if (!activeBoard && boards.length > 0){
    dispatch(boardsSlices.actions.setBoardActive({index : 0}))
  }



  const [boardModalOpen, setBoardModalOpen] = useState(false)

  return(
    <div
    className=' overflow-hidden overflow-x-scroll'
    >
      <>
        {boards.length > 0 ?
        <>  
          {/* Header Section */}

          <Header boardModalOpen = {boardModalOpen} setBoardModalOpen = {setBoardModalOpen}/>

          {/* Center Section */}

          <Center boardModalOpen = {boardModalOpen} setBoardModalOpen = {setBoardModalOpen}/>
        </>
        :
        <>
          <EmptyBoard type='add'/>
        </>
      }
      </>
    </div>
  )
}

export default App