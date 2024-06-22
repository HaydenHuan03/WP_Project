// Function: Add board or edit the existing board
import React, {useState} from 'react'
//To generate unique id
import {v4 as uuidv4} from 'uuid'
import crossIcon from  '../assests/icon-cross.svg'
import { useDispatch, useSelector } from 'react-redux'
import boardSlices from '../redux/boardSlice'
import axios from 'axios'

// AddEditBoardModal component
function AddEditBoardModal({setBoardModalOpen, type}) {
    const dispatch = useDispatch()

    // The first parameter is current value, second parameter is function to update the state

    // Store the name of the board
    const [name, setName] = useState('')

    const[isFirstLoad, setIsFirstLoad] = useState(true)

    const board = useSelector((state) => state.boards).find((board) => board.isActive)

    // Track whether the form of input is valid or not
    const [isValid, setIsValid] = useState(true)

    // An array of columns objects, each with name, task and unique id
    const[newColumns, setNewColumns] = useState(
        [
            {name : 'Todo', tasks : [], id : uuidv4()},
            {name : 'Doing', tasks : [], id : uuidv4()},
            {name : 'Done', tasks : [], id : uuidv4()}
        ]
    ) 

    if (type === 'edit' && isFirstLoad){
        setNewColumns(
            board.columns.map((col)=>{
                return { ...col, id : uuidv4() }
            })
        )
        setName(board.name)
        setIsFirstLoad(false)
    }

    // Update the columns name based on its id
    const onChange = (id, newValue) => {
        setNewColumns((prevState) => {
            const newState = [...prevState]
            const column = newState.find((col) => col.id === id)
            column.name = newValue
            return newState
        })
    }

    // Delete the board columns based on its id
    const onDelete = (id) =>{
        setNewColumns((perState) => perState.filter((el) => el.id !== id) )
    }
    
    // To ensure both the board name and column name is not empty
    const validate = () => {
        setIsValid(false)

        if(!name.trim())
            return false

        for (let i = 0; i < newColumns.length; i++){
            if(!newColumns[i].name.trim()){
                return false
            }
        }

        setIsValid(true)
        return true
    }


    // Add or edit a board based on the type with action 'dispatch'
    const onSubmit =  (type) => {
        const isValid = validate();
        if (!isValid) return;
    
        const payload = {
            type: type,
            name: name,
            columns: newColumns,
        };
    
        if (type === 'edit') {
            payload.board_id = board.id;
        }
    
        try {
            axios.post('http://localhost:80/wp_api/AddEditBoard.php', payload).then(function(response){
                console.log(response.data.message);
                // Handle success (e.g., update Redux state)
                if (type === 'add') {
                    dispatch(boardSlices.actions.addBoard({ name, newColumns }));
                } else {
                    dispatch(boardSlices.actions.editBoard({ name, newColumns }));
                }
                setBoardModalOpen(false);
            })
        } catch (error) {
            console.error('Error:', error);
        }
    };


  return (
    <div
    onClick={(e)=>{
        if(e.target === e.currentTarget){
            setBoardModalOpen(false)
        }
    }}

    className=' fixed right-0 left-0 top-0 bottom-0 px-2 scrollbar-hide py-4 overflow-scroll z-50
    justify-cneter items-center flex bg-[#00000080]'
    >
        {/* Modal Section */}
        <div
        className=' scrollbar-hide overflow-y-scroll max-h-[95vh] bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold shadow-md shadow-[#364e7e1a]
         max-w-md mx-auto w-full px-8 py-8 rounded-xl'
        >
            <h3 className=' text-lg'>
                {type === 'edit' ? 'Edit':'Add New'} Board
            </h3>

            {/* Task Name */}
            <div className=' mt-8 flex flex-col space-y-3'>
                <label
                className=' text-sm dark:text-white text-gray-500'
                >
                    Board Name
                </label>
                <input type='text'
                className=' bg-transparent px-4 py-2 rounded-md text-sm border
                 border-gray-600 outline-none focus:outline-[#635fc7] outline-1 ring-0
                ' 
                placeholder=' e.g Web Design'
                value={name}
                onChange={(e) =>{
                    setName(e.target.value);
                }}
                id='board-name-input'
                />
            </div>

            {/* Board Columns */}

            <div
            className=' mt-8 flex flex-col space-y-3'
            >
                    <label 
                    className=' text-sm dark:text-white text-gray-500'
                    >
                        Board Columns
                    </label>

                    {
                        newColumns.map((column, index) =>(
                            <div key={index}  className=' flex items-center w-full'>
                                <input type="text"
                                className=' bg-transparent flex-grow px-4 py-2 rounded-md
                                text-sm border border-gray-600 outline-none focus:outline-[#735fc7]'
                                onChange={(e) => {
                                    onChange(column.id, e.target.value)
                                }}
                                value={column.name}
                                />

                                <img src={crossIcon} className=' cursor-pointer m-4' onClick={()=>{
                                    onDelete(column.id)
                                }} />

                            </div>
                        ))
                    }

                    <div>
                        <button
                        className=' w-full items-center hover:opacity-75 dark:text-[#635fc7]
                         dark:bg-white text-white bg-[#635fc7] mt-2 py-3 rounded-full'

                         onClick={()=>{
                            setNewColumns((state)=>[
                                ...state,
                                {name : '', tasks : [], id : ''},
                            ])
                         }}
                        >
                            + Add new column
                        </button>

                        <button
                        className=' w-full items-center hover:opacity-75 dark:text-white dark:bg-[#635fc7] mt-3 py-3 relative text-white bg-[#635fc7]
                        rounded-full'
                        onClick={
                            () =>{
                                const isValid = validate()
                                if( isValid === true) onSubmit(type)
                            }
                        }
                        >
                            {type === 'add' ? 'Create New Board': 'Save Changes'}
                        </button>
                    </div>

                </div>
        </div>
    </div>
  )
}

export default AddEditBoardModal