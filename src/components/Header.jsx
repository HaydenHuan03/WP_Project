import React, { useEffect, useState } from 'react'
import logo from '../assests/lollipop-32x32.png'
import iconDown from '../assests/icon-chevron-down.svg'
import iconUp from '../assests/icon-chevron-up.svg'
import elipsis from '../assests/icon-vertical-ellipsis.svg'
import HeaderDropdown from './HeaderDropdown'
import AddEditBoardModal from '../modals/AddEditBoardModal'
import { useDispatch, useSelector } from 'react-redux'
import AddEditTaskModal from '../modals/AddEditTaskModal'
import ElipsisMenu  from './ElipsisMenu'
import DeleteModal from '../modals/DeleteModal'
import {fetchBoards, boardsSlices} from '../redux/boardSlice'

function Header({setBoardModalOpen, boardModalOpen}) {
    const dispatch = useDispatch()

    // State to manage the visibility of the dropdown menu
    const [openDropDown, setOpenDropDown] = useState(false)

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    // State to manage the visibility of the add/edit task modal
    const [openAddEditTask, setOpenAddEditTask] = useState(false)

    const[isElipsisOpen, setIsElipsisOpen] = useState(false)

    // State to manage whether the board modal is in 'add' or 'edit' mode
    const [boardType, setBoardType] = useState('add')

    // Get the list of boards from the Redux store
    const boards = useSelector((state) => state.boards)

    // Get the currently active board
    const board = boards ? boards.find((board) => board.isActive) : null

    useEffect(()=>{
        dispatch(fetchBoards());
    }, [dispatch]);

    const setOpenEditModal = () => {
        setBoardModalOpen(true)
        setIsElipsisOpen(false)
    }

    const setOpenDeleteModal = () => {
        setIsDeleteModalOpen(true)
        setIsElipsisOpen(false)
    }

    const onDeleteBtnClick = () => {
        dispatch(boardsSlices.actions.deleteBoard())
        dispatch(boardsSlices.actions.setBoardActive({index : 0}))
        setIsDeleteModalOpen(false)
    }

    const onDropdownClick = () => {
        setOpenDropDown((state) => !state)
        setIsElipsisOpen(false)
        setBoardType('add')
    }

  return (
    <div className=' p-4 fixed left-0 bg-white dark:bg-[#2b2c37] z-50 right-0'>
        <header className=' h-10 flex justify-between dark:text-white items-center'>

            {/* Left Side */}

            <div className='flex items-center space-x-2 md:space-x-4 '>
                <img src={logo} alt="logo" className=' h-6 w-6'/>
                <h3 className=' hidden md:inline-block font-bold font-sans md:text-2xl'>
                    SuperLollipop Task Manager
                </h3>
                <div className=' flex items-center'>
                    <h3 className=' truncate max-w-[200px] md:text-2xl text-xl font-bold md:ml-20 font-sans'>
                        {board? board.name : ' '}
                    </h3>
                    <img src={openDropDown ? iconUp :iconDown}
                     alt="dropdown icon"
                    className=' w-3 ml-2 cursor-pointer md:hidden'
                    onClick={onDropdownClick}
                    />

                </div>
            </div>

            {/* Right Side */}

            <div className=' flex space-x-4 items-center md:space-x-6'>
                <button 
                    onClick={
                        () =>
                        setOpenAddEditTask(state => !state)}
                    
                    className=' hidden md:block button'
                >
                    + Add New Task
                </button>

                <button 
                    onClick={
                        () =>
                        setOpenAddEditTask(state => !state)
                }
                className='button py-1 px-3 md:hidden'>+</button>
                
                <img src={elipsis} onClick={() => {
                    setBoardType('edit')
                    setOpenDropDown(false)
                    setIsElipsisOpen(state => !state)
                }} alt="elipsis" className=' cursor-pointer h-6'/>

                {
                    isElipsisOpen && <ElipsisMenu type='Boards'
                    setOpenDeleteModal={setOpenDeleteModal}
                    setOpenEditModal={setOpenEditModal}
                    />
                }
            </div>

        </header>

        {
        openDropDown && <HeaderDropdown setBoardModalOpen={setBoardModalOpen} setOpenDropDown={setOpenDropDown}/>
        }

        {
        boardModalOpen && <AddEditBoardModal type={boardType} setBoardModalOpen = {setBoardModalOpen}/>
        }

        {
            openAddEditTask && <AddEditTaskModal setOpenAddEditTask={setOpenAddEditTask} device='mobile' type='add'/>
        }

        {
            isDeleteModalOpen && <DeleteModal setIsDeleteModalOpen={setIsDeleteModalOpen} onDeleteBtnClick={onDeleteBtnClick} title={board.name} type='board'/>
        }

    </div>
  )
}

export default Header