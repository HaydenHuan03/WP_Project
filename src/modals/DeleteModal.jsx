import React from 'react'

function DeleteModal({type, title, onDeleteBtnClick, setIsDeleteModalOpen}) {
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
                onClick={onDeleteBtnClick}
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