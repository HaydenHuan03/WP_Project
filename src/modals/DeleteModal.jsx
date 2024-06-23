import React from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import boardsSlices from '../redux/boardSlice'

function DeleteModal({type, title, id, colIndex, taskIndex, setIsDeleteModalOpen}) {
    //Select the active board from redux store
    const boards = useSelector(state => state.boards)
    const board = boards.find(board => board.isActive)
    const columns = board?.columns
    const col = columns?.[colIndex];
    const task = col?.tasks?.[taskIndex];
    const modal_id = type === 'task'? task.id : board.id
    const dispatch = useDispatch();

    //Function to handle delete function
    const handleDelete = () =>{
        const payload = {
            id : modal_id,
            type: type
        }
        try{
            // Send delete request to the server
            axios.post('http://localhost:80/wp_api/DeleteModal.php', payload).then(function(response){
                console.log(response.data);
                if(type === 'board'){
                    // Dispatch action to delete the board
                    dispatch(boardsSlices.actions.deleteBoard({boardID: id}))
                }else if(type === 'task'){
                    // Dispatch action to delete
                    dispatch(boardsSlices.actions.deleteTask({taskId: id, colIndex, taskIndex}))
                }

                // close the modal
                setIsDeleteModalOpen(false)
            })

        }catch(error){
            console.log("Error:", error)
        }
    }

    //Return null if board or task is not found
    if (!board || (type === 'task' && !task)) {
        return null;
    }

  return (
    // Modal Container
    <div
    className=' fixed right-0 bottom-0 left-0 top-0 px-2 py-4 overflow-scroll scrollbar-hide z-50 justify-center
     items-center flex bg-[#00000080]'
     onClick={(e) => {
        if ( e.target !== e.currentTarget ){
            return 
        }
        setIsDeleteModalOpen(false) 
     }}
    >
        {/* Delete Modal */}

        <div
        className=' scrollbar-hide overflow-y-scroll max-w-md max-h-[95vh] my-auto bg-white dark:bg-[#2b2c37]
        text-black dark:text-white w-full px-8 py-8 rounded-xl'>

            <h3
            className=' font-bold text-red-500 '
            >
                Delete this {type} ?
            </h3>

            {type === 'task' ?(
                <p
                className=' text-gray-500 font-semibold tracking-width text-sm pt-6'
                >
                    Are you sure you want to delete the "{title}"
                    task and its subtasks?
                    This action cannot be reserved
                </p>
            ):<p
            className=' text-gray-500 font-semibold tracking-width text-sm pt-6'
            >
                    Are you sure you want to delete the "{title}" board?
                    This action
                    will remove all columns and tasks and cannot be
                    reserved.
            </p>
            }

            <div
            className=' flex w-full mt-4 items-center justify-center space-x-4'
            >
                <button
                onClick={handleDelete}
                className=' w-full items-center text-white hover:opacity-75 bg-red-500 font-semibold py-2 rounded-full'
                >
                    Delete
                </button>

                <button
                onClick={() => setIsDeleteModalOpen(false)}
                className=' w-full items-center text-[#635fc7] hover:opacity-75 bg-[#634b9b31] font-semibold py-2 rounded-full'
                >
                    Cancel
                </button>


            </div>

        </div>
    </div>
  )
}

export default DeleteModal