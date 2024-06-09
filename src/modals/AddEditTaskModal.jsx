import React, { useState } from 'react'
import crossIcon from "../assests/icon-cross.svg";
import {v4 as uuidv4} from 'uuid'
import { useDispatch, useSelector } from 'react-redux';
import boardsSlices from '../redux/boardSlice';

function AddEditTaskModal({type , device, setOpenAddEditTask, taskIndex, pervColIndex = 0}) {
    const dispatch = useDispatch()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [isValid, setIsValid] = useState(true)

    const board = useSelector((state) => state.boards).find((board) => board.isActive)

    const columns = board.columns
    const col = columns.find((col, index) => index === pervColIndex)
    const [status, setStatus] = useState(columns[pervColIndex].name)
    const [newColIndex, setNewColIndex] = useState(pervColIndex)

    const [subtasks, setSubtasks] = useState(
        [
            {title: '', isCompleted: false, id : uuidv4()},
            {title: '', isCompleted: false, id : uuidv4()},
        ]
    )

    const onChange = (id, newValue) => {
        setSubtasks((pervState) => {
            const newState = [...pervState]
            const subtask = newState.find((subtask) => subtask.id === id)
            subtask.title = newValue
            return newState
        })
    }

    const onChangeStatus = (e) =>{
        setStatus(e.target.value)
        setNewColIndex(e.target.selectedIndex)
    }

    const onDelete = (id) => {
        setSubtasks((perState) => perState.filter((el) => el.id !== id) )
    }

    const validate = () => {
        setIsValid(false)

        if(!title.trim())
            return false

        for (let i = 0; i < subtasks.length; i++){
            if(!subtasks[i].title.trim()){
                return false
            }
        }

        setIsValid(true)
        return true
    }

    const onSubmit = (type) =>{
        if(type === 'add'){
            dispatch(boardsSlices.actions.addTask({
                title, description, subtasks, status, newColIndex
            }))
        }else{
            dispatch(boardsSlices.actions.editTask)({
                title,
                description,
                subtasks,
                status,
                taskIndex,
                pervColIndex,
                newColIndex
            })
        }
    }

  return (
    <div
    onClick={(e)=> {
        if(e.target !== e.currentTarget){
            return
        }
        setOpenAddEditTask(false)
    }}
    className={
        device === 'mobile' ? ' py-6 px-6 pb-50 absolute overflow-y-scroll left-0 flex right-0 bottom-[-100vh] top-0 bg-[#00000080]' 
        : 'py-6 px-6 pb-40 absolute overflow-y-scroll left-0 flex right-0 bottom-0 top-0 bg-[#00000080]'
    }
    >
        {/* Modal Section */}
        <div 
        className=' scrollbar-hide overflow-y-scroll max-h-[95vh] my-auto
         bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold
         shadow-md shadow-[#364e7e1a] max-w-md mx-auto w-full px-8 py-8 rounded-xl'
        >
            <h3 className=' text-lg'
            >
                {type === 'edit' ? 'Edit' : 'Add New'}Task
                
            </h3>

            {/* Task Name */}

            <div
            className=' mt-8 flex flex-col space-y-1'
            >
                <label 
                className=' text-sm dark:text-white text-gray-500'
                >
                    Task Name
                </label>
                <input 
                value = {title}
                onChange={(e)=> setTitle(e.target.value)}
                className=' bg-transparent px-4 py-2 outline-none focus:border-0 rounded-md text-sm border
                 border-gray-600 focus:outline-[#635fc7] ring-0'
                type="text" 
                placeholder='e.g Do COA Past Year '
                />
            </div>

            <div
            className=' mt-8 flex flex-col space-y-1'
            >
                <label 
                className=' text-sm dark:text-white text-gray-500'
                >
                    Task Description
                </label>
                <textarea
                value = {description}
                onChange={(e)=> setDescription(e.target.value)}
                className=' bg-transparent px-4 py-2 outline-none focus:border-0 min-h-[200px] rounded-md text-sm border
                 border-gray-600 focus:outline-[#635fc7] ring-0'
                placeholder='As a revision for final exam'
                />
            </div>

            {/* Subtasks Section */}

            <div
            className=' mt-8 flex flex-col space-y-1'
            >
                <label 
                className=' text-sm dark:text-white text-gray-500'
                >
                    Subtasks
                </label>

                {
                    subtasks.map((subtask, index) => (
                            <div
                            key={index}
                            className=' flex items-center w-full'
                            >
                                <input 
                                type='text' 
                                onChange={(e)=>{
                                    onChange(subtask.id, e.target.value)
                                }}
                                value={subtask.title}
                                className=' bg-transparent outline-none focus:border-0 border flex-grow
                                 px-4 py-2 rounded-md text-sm border-gray-600 focus:outline-[#635fc7]
                                 '
                                 placeholder=' e.g Focus on coding part'
                                />
                                <img 
                                onClick={
                                    ()=>{
                                        onDelete(subtask.id)
                                    }
                                }
                                src={crossIcon} className=' m-4 cursor-pointer '/>
                            </div>
                    ))
                }

                <button
                onClick={() => {
                    setSubtasks((state) =>[
                        ...state,
                        {title: '', isCompleted: false, id : uuidv4()},
                    ])
                }}
                className=' w-full items-center dark:text-[#635fc7] 
                 dark:bg-white text-white bg-[#635fc7] py-2 rounded-full'
                >
                    + Add New Subtask
                </button>
            </div>


                {/* select status  */}
                {/* Current Status Section */}

                <div
                 className=' mt-8 flex flex-col space-y-3'
                >
                    <label className=' text-sm dark:text-white text-gray-500'>
                        Current status
                    </label>
                    <select
                    value={status}
                    onChange={(e) => onChangeStatus(e)}
                    className=' select-status flex flex-grow  px-4 py-2 rounded-md 
                     text-sm bg-transparent focus:border-0 border-[1px]
                     border-gray-300  focus:outline-[#635fc7]  outline-none'>
                            {columns.map((column, index) => (
                            <option className='dark:bg-[#2b2c37] dark:text-white'
                                value={column.name}
                                key={index}
                            >
                                {column.name}
                            </option>
                        ))}
                    </select>

                    <button
                    onClick={() => {
                        const isValid = validate()
                        if(isValid){
                            onSubmit(type)
                            setOpenAddEditTask(false)
                        }
                    }}
                    className=' w-full items-center text-white bg-[#635fc7] py-2 rounded-full '
                    >
                        {type === 'edit' ? 'Save Edit' : 'Create Task'}
                    </button>
                </div>
        </div>

    </div>
  )
}

export default AddEditTaskModal