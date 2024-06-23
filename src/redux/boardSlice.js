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
              const column = board.columns[newColIndex];
              if (column) {
                  column.tasks = column.tasks || [];
                  column.tasks.push(task);
              }
          }
      },
      editTask: (state, action) => {
        const { id, title, status, description, subtasks, dueDate, prevColIndex, newColIndex, taskIndex } = action.payload;
        const board = state.find(board => board.isActive);
        if (board) {
            const prevCol = board.columns[prevColIndex];
            const task = prevCol.tasks[taskIndex];
            task.title = title;
            task.status = status;
            task.description = description;
            task.subtasks = subtasks;
            task.dueDate = dueDate;
            if (prevColIndex !== newColIndex) {
                const newCol = board.columns[newColIndex];
                prevCol.tasks.splice(taskIndex, 1);
                newCol.tasks.push(task);
            }
        }
    },
        dragTask: (state, action) => {
          const { colIndex, prevColIndex, taskIndex } = action.payload;
          const board = state.find((board) => board.isActive);
          const prevCol = board.columns.find((col, i) => i === prevColIndex);
          const task = prevCol.tasks.splice(taskIndex, 1)[0];
          board.columns.find((col, i) => i === colIndex).tasks.push(task);
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