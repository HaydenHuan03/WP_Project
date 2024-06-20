//Client-side 'store room'
import { debounce } from "lodash";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchBoards = createAsyncThunk('boards/fetchBoards', async()=>{
  const response = await fetch('http://localhost:80/wp_api/board.php');
  if (!response.ok) {
    throw new Error('Network response is not ok');
  }
  const data = await response.json();
  return data.boards;
});

export const fetchBoardsDebounced = debounce((dispatch)=>{
  dispatch(fetchBoards())
})

export const boardsSlices = createSlice({
    name: 'boards',
    initialState : [],
    reducers: {
        addBoard: (state, action) => {
          const isActive = state.length === 0;
          const payload = action.payload;
          const board = {
            name: payload.name,
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
        },
        deleteBoard: (state) => {
          const board = state.find((board) => board.isActive);
          state.splice(state.indexOf(board), 1);
        },
        setBoardActive: (state, action) => {
          state.map((board, index) => {
            index === action.payload.index
              ? (board.isActive = true)
              : (board.isActive = false);
            return board;
          });
        },
        addTask: (state, action) => {
          const { title, status, description, subtasks, dueDate, newColIndex } = action.payload;
          const task = { title, description, subtasks, status, dueDate };
        
          return state.map((board) => {
            if (board.isActive) {
              const updatedColumns = board.columns.map((col, index) => {
                if (index === newColIndex) {
                  // Check if col.tasks exists, if not, initialize it as an empty array
                  const tasks = col.tasks || [];
                  return {
                    ...col,
                    tasks: [...tasks, task],
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
        editTask: (state, action) => {
          const {
            title,
            status,
            description,
            subtasks,
            dueDate,
            prevColIndex,
            newColIndex,
            taskIndex,
          } = action.payload;
        
          return state.map((board) => {
            if (board.isActive) {
              const updatedColumns = board.columns.map((col, colIndex) => {
                if (colIndex === prevColIndex) {
                  const updatedTasks = col.tasks.map((task, taskIdx) => {
                    if (taskIdx === taskIndex) {
                      return {
                        ...task,
                        title,
                        status,
                        description,
                        subtasks,
                        dueDate,
                      };
                    }
                    return task;
                  });
        
                  return {
                    ...col,
                    tasks: updatedTasks,
                  };
                } else if (colIndex === newColIndex) {
                  const task = col.tasks.find((task, taskIdx) => taskIdx === taskIndex);
                  const updatedTask = {
                    ...task,
                    title,
                    status,
                    description,
                    subtasks,
                    dueDate,
                  };
                  const updatedTasks = col.tasks.map((task, taskIdx) =>
                    taskIdx === taskIndex ? updatedTask : task
                  );
        
                  return {
                    ...col,
                    tasks: updatedTasks,
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
          const payload = action.payload;
          const board = state.find((board) => board.isActive);
          const col = board.columns.find((col, i) => i === payload.colIndex);
          col.tasks = col.tasks.filter((task, i) => i !== payload.taskIndex);
        },
      },
      extraReducers: (builder) => {
        builder.addCase(fetchBoards.fulfilled, (state,action) => {
          return action.payload;
        });
      },
})

export default boardsSlices;