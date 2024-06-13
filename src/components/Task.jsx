import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TaskModal from '../modals/TaskModal'
import boardsSlices from '../redux/boardSlice'

function Task({taskIndex, colIndex}) {
    const dispatch = useDispatch()
    const boards = useSelector(state => state.boards)
    const board = boards.find(board => board.isActive)
    const columns = board.columns
    const col = columns.find((col, i) => i === colIndex)
    const task = col.tasks.find((task, i) => i === taskIndex)

    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

    let completed = 0
    let subtasks = task.subtasks
    subtasks.forEach((subtask) => {
        if(subtask.isCompleted){
            completed++
        }
    })

    const handleOnDrag = (e) => {
        e.dataTransfer.setData(
            "text",
            JSON.stringify({taskIndex, prevColIndex : colIndex})
        );
    };

  return (
    <div>
        <div
        onDragStart={handleOnDrag}
        draggable
        onClick={()=>{
            setIsTaskModalOpen(true)
        }}
        className=' w-[280px] first: my-5 rounded-lg bg-white dark:bg-[#2b2c37] 
        shadow-[#364e7e1a] py-6 px-3 shadow-lg hover:text-[#635fc7] dark:text-white dark:hover:text-[#635fc7] cursor-pointer'
        >
            <p
            className=' font-bold tracking-wide'
            >
                {task.title}
            </p>

            <p
            className=' font-bold text-xs tracking-tighter mt-2 text-gray-500'
            >
                {completed} of  {subtasks.length} completed tasks

            </p>

            <p
            className=' font-bold text-xs tracking-tighter mt-2 text-gray-500'>
                Deadline: {task.dueDate? task.dueDate:'No deadline is set'}
            </p>
        </div>
        {
            isTaskModalOpen && (
            <TaskModal colIndex={colIndex} taskIndex={taskIndex} setIsTaskModalOpen={setIsTaskModalOpen}/>
            )
        }
    </div>
  )
}

export default Task