import React, { useEffect, useState } from 'react'
import crossIcon from "../assests/icon-cross.svg";
import {v4 as uuidv4} from 'uuid'
import { useDispatch, useSelector } from 'react-redux';
import boardsSlices from '../redux/boardSlice';
import axios from 'axios';

function AddEditTaskModal({type , device, setOpenAddEditTask,  setIsTaskModalOpen, taskIndex, prevColIndex = 0}) {
    const dispatch = useDispatch()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [isValid, setIsValid] = useState(true)
    const [taskId, setTaskId] = useState(null)
    const [newColIndex, setNewColIndex] = useState(prevColIndex)
    const[isFirstLoad, setIsFirsLoad] = useState(true)    
    const [subtasks, setSubtasks] = useState(
        [
            {title: '', isCompleted: false, id : uuidv4()},
            {title: '', isCompleted: false, id : uuidv4()},
        ]
    )

    // Get the active board from redux store
    const board = useSelector((state) => state.boards).find((board) => board.isActive)
    const columns = board?.columns || []
    const col = columns[prevColIndex]
    const task = col?.tasks?.[taskIndex]
    const [status, setStatus] = useState(columns[prevColIndex].name)

    useEffect(() => {
        if(type === 'edit' && isFirstLoad && task){
            setSubtasks(
                task.subtasks.map((subtask) => {
                    return {...subtask, id : uuidv4()}
                })
            )
            setTaskId(task.id)
            setTitle(task.title)
            setDescription(task.description)
            setDueDate(task.dueDate || '')
            setIsFirsLoad(false)
        }
    },[type, task, prevColIndex, columns])

    //Handle subtask input change
    const onChange = (id, newValue) => {
        setSubtasks((pervState) => {
            const newState = [...pervState]
            const subtask = newState.find((subtask) => subtask.id === id)
            subtask.title = newValue
            return newState
        })
    }

    // Handle change in task status
    const onChangeStatus = (e) =>{
        setStatus(e.target.value)
        setNewColIndex(e.target.selectedIndex)
    }

    // Handle deletion of a subtask
    const onDelete = (id) => {
        setSubtasks((perState) => perState.filter((el) => el.id !== id) )
    }

    // Validate of task input
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

    // Handle form submission for adding or editing a task
    const onSubmit = (type) =>{
        const payload = {
            title,
            description,
            subtasks,
            status,
            dueDate,
            column_id: columns[newColIndex].id,
            prevColIndex,
            type,
            taskId: taskId,
            taskIndex
        }
        if(type === 'edit'){
            payload.taskIndex = taskIndex;
        }
        

        axios.post('http://localhost:80/wp_api/AddEditTask.php',payload).then(function(response){
            console.log(response.data)
            if(type === 'add'){
                dispatch(boardsSlices.actions.addTask(payload))
            }else{
                dispatch(boardsSlices.actions.editTask(payload))
            }
            setOpenAddEditTask(false);
            setIsTaskModalOpen(false);
        })
        .catch(error => {
            console.error('There has an error', error)
        })
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
        device === 'mobile' ? ' scrollbar-hide py-6 px-6 pb-50 absolute overflow-y-scroll left-0 flex right-0 bottom-[-100vh] top-0 bg-[#00000080]' 
        : 'scrollbar-hide py-6 px-6 pb-40 absolute overflow-y-scroll left-0 flex right-0 bottom-0 top-0 bg-[#00000080]'
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

            {/* Deadline section */}
            <div
            className=' mt-8 flex flex-col space-y-1'
            >
                <label 
                className=' text-sm dark:text-white text-gray-500'
                >
                    Deadline
                </label>
                <div
                    className=' flex items-center w-full'
                    >
                    <input 
                    type='date'
                    value={dueDate} 
                    onChange={(e)=>{
                        setDueDate(e.target.value)
                    }}
                    className=' bg-transparent outline-none focus:border-0 border flex-grow
                    px-4 py-2 rounded-md text-sm border-gray-600 focus:outline-[#635fc7]
                    '
                    placeholder=' e.g 01-01-2003'
                    />
                </div>
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