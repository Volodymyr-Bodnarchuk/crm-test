import { configureStore } from '@reduxjs/toolkit';
import { todoApiSlice } from './todo-api-slice';

export const store = configureStore({
  reducer: {
    [todoApiSlice.reducerPath]: todoApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(todoApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
