import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import boardsSlices from '../redux/boardSlice'
import AddEditTaskModal from '../modals/AddEditTaskModal'
import axios from 'axios'

function Subtask({index, taskIndex, colIndex}) {
    const dispatch = useDispatch()
    const boards = useSelector(state => state.boards)
    const board = boards.find(board => board.isActive)
    const columns = board.columns
    const col = columns.find((column, i) => colIndex === i)
    const task = col.tasks.find((col, i) => taskIndex === i)
    const subtask = task.subtasks.find((subtask, i) => i === index)
    const checked = subtask.isCompleted

    const onChange = (e) => {
        const isCompleted = e.target.checked ? 1 : 0;

        axios.post('http://localhost:80/wp_api/UpdateSubtask.php', {
            action: 'update_subtask_status',
            subtaskId: subtask.id,
            isCompleted
        }).then(response => {
            console.log(subtask.id)
            if (response.data.success) {
                dispatch(boardsSlices.actions.setSubtaskCompleted({ index, taskIndex, colIndex }));
            } else {
                console.error('Failed to update subtask status:', response.data.message);
            }
        }).catch(error => {
            console.error('Error:', error);
        });
    }


  return (
    <div
    className=' w-full flex hover:bg-[#635fc740] dark:hover:bg-[#635fc740] rounded-md relative items-center
     justify-start dark:bg-[#20212c] p-3 gap-4 bg-[#f4f7fd]'
    >
        <input type="checkbox" className=' w-4 h-4 accent-[#635fc7]
        cursor-pointer'
        checked = {checked} 
        onChange = {onChange}
        />
        <p
        className={checked? ' line-through opacity-30' : ''}
        >
            {subtask.title}
        </p>
    </div>
  )
}

export default Subtask