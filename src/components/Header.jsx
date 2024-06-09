import React, { useState } from 'react'
import logo from '../assests/logo-mobile.svg'
import iconDown from '../assests/icon-chevron-down.svg'
import iconUp from '../assests/icon-chevron-up.svg'
import elipsis from '../assests/icon-vertical-ellipsis.svg'
import HeaderDropdown from './HeaderDropdown'
import AddEditBoardModal from '../modals/AddEditBoardModal'
import { useDispatch, useSelector } from 'react-redux'
import AddEditTaskModal from '../modals/AddEditTaskModal'

function Header({setBoardModalOpen, boardModalOpen}) {
    const dispatch = useDispatch()

    // State to manage the visibility of the dropdown menu
    const [openDropDown, setOpenDropDown] = useState(false)

    // State to manage the visibility of the add/edit task modal
    const [openAddEditTask, setOpenAddEditTask] = useState(false)

    // State to manage whether the board modal is in 'add' or 'edit' mode
    const [boardType, setBoardType] = useState('add')

    // Get the list of boards from the Redux store
    const boards = useSelector( (state)=> state.boards)

    // Get the currently active board
    const board = boards.find(board => board.isActive)


  return (
    <div className=' p-4 fixed left-0 bg-white dark:bg-[#2b2c37] z-50 right-0'>
        <header className='flex justify-between dark:text-white items-center'>

            {/* Left Side */}

            <div className='flex items-center space-x-2 md:space-x-4 '>
                <img src={logo} alt="logo" className=' h-6 w-6'/>
                <h3 className=' hidden md:inline-block font-bold font-sans md:text-2xl'>
                    SuperLollipop Task Manager
                </h3>
                <div className=' flex items-center'>
                    <h3 className=' truncate max-w-[200px] md:text-2xl text-xl font-bold md:ml-20 font-sans'>
                        {board.name}
                    </h3>
                    <img src={openDropDown ? iconUp :iconDown}
                     alt="dropdown icon"
                    className=' w-3 ml-2 cursor-pointer md:hidden'
                    onClick={()=> setOpenDropDown(state => !state)}
                    />

                </div>
            </div>

            {/* Right Side */}

            <div className=' flex space-x-4 items-center md:space-x-6'>
                <button className= ' hidden md:block button'>+ Add New Task</button>

                <button 
                    onClick={
                        () =>
                        setOpenAddEditTask(state => !state)
                }
                className='button py-1 px-3 md:hidden'>+</button>
                
                <img src={elipsis} alt="elipsis" className=' cursor-pointer h-6'/>
            </div>

        </header>

        {openDropDown && <HeaderDropdown setBoardModalOpen={setBoardModalOpen} setOpenDropDown={setOpenDropDown}/>}

        {boardModalOpen && <AddEditBoardModal type={boardType} setBoardModalOpen = {setBoardModalOpen}/>}

        {
            openAddEditTask && <AddEditTaskModal setOpenAddEditTask={setOpenAddEditTask} device='mobile' type='add'/>
        }

    </div>
  )
}

export default Header