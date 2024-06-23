//Client-side 'store room'
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid'

export const fetchBoards = createAsyncThunk('boards/fetchBoards', async()=>{
  const userId = localStorage.getItem('user_id');
  const response = await fetch(`http://localhost:80/wp_api/board.php?user_id=${userId}`);
  if (!response.ok) {
    throw new Error('Network response is not ok');
  }
  const data = await response.json();
  
  if (data.boards.length > 0) {
    data.boards[0].isActive = true;
  }

  return data.boards;
});


export const boardsSlices = createSlice({
    name: 'boards',
    initialState : [],
    reducers: {
        addBoard: (state, action) => {
          const isActive = state.length === 0;
          const payload = action.payload;
          const board = {
            id: uuidv4(),
            name: payload.name,
            userId: payload.userId,
            isActive,
            columns: [],
          };
          board.columns = payload.newColumns;
          state.push(board);
        },
        editBoard: (state, action) => {
          const payload = action.payload;
          const board = state.find((board) => board.isActive);
          board.name = payload.name;
          board.columns = payload.newColumns;
          board.userId = payload.userId;
        },
        deleteBoard: (state) => {
          const board = state.find((board) => board.isActive);
          state.splice(state.indexOf(board), 1);
        },
        setBoardActive: (state, action) => {
          return state.map(board => ({
            ...board,
            isActive: board.id === action.payload.boardId
          }));

        },
        addTask: (state, action) => {
          const { title, status, description, subtasks, dueDate, newColIndex } = action.payload;
          const task = { id: uuidv4(), title, description, subtasks, status, dueDate };
          const board = state.find(board => board.isActive);
        
          if (board) {
            board.columns = board.columns.map((column, colIndex) => {
              if (colIndex === newColIndex) {
                return {
                  ...column,
                  tasks: [...(column.tasks || []), task],
                };
              }
              return column;
            });
          }
        },
      editTask: (state, action) => {
        const {
          id,
          title,
          status,
          description,
          subtasks,
          dueDate,
          prevColIndex,
          newColIndex,
        } = action.payload;
      
        return state.map((board) => {
          if (board.isActive) {
            const updatedColumns = board.columns.map((col, colIndex) => {
              // Remove the task from the previous column
              if (colIndex === prevColIndex) {
                return {
                  ...col,
                  tasks: col.tasks.filter((task) => task.id !== id),
                };
              }
      
              // Add the updated task to the new column
              if (colIndex === newColIndex) {
                const updatedTask = {
                  id,
                  title,
                  description,
                  subtasks,
                  status,
                  dueDate,
                };
                return {
                  ...col,
                  tasks: [...col.tasks, updatedTask],
                };
              }
      
              return col;
            });
      
            return {
              ...board,
              columns: updatedColumns,
            };
          }
      
          return board;
        });
      },      
        setSubtaskCompleted: (state, action) => {
          const payload = action.payload;
          const board = state.find((board) => board.isActive);
          const col = board.columns.find((col, i) => i === payload.colIndex);
          const task = col.tasks.find((task, i) => i === payload.taskIndex);
          const subtask = task.subtasks.find((subtask, i) => i === payload.index);
          subtask.isCompleted = !subtask.isCompleted;
          axios
        },
        setTaskStatus: (state, action) => {
          const payload = action.payload;
          const board = state.find((board) => board.isActive);
          const columns = board.columns;
          const col = columns.find((col, i) => i === payload.colIndex);
          if (payload.colIndex === payload.newColIndex) return;
          const task = col.tasks.find((task, i) => i === payload.taskIndex);
          task.status = payload.status;
          col.tasks = col.tasks.filter((task, i) => i !== payload.taskIndex);
          const newCol = columns.find((col, i) => i === payload.newColIndex);
          newCol.tasks.push(task);
        },
        deleteTask: (state, action) => {
          const { taskId, colIndex } = action.payload;
          const board = state.find((board) => board.isActive);
          const col = board.columns.find((col, i) => i === colIndex);
          col.tasks = col.tasks.filter(task => task.id !== taskId);
        },
      },
      extraReducers: (builder) => {
        builder.addCase(fetchBoards.fulfilled, (state,action) => {
          return action.payload;
        });
      },
})

export default boardsSlices;