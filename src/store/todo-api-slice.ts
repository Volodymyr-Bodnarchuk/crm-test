import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Todo {
  id: string;
  name: string;
  status: 'todo' | 'doing' | 'done';
  createdAt: string;
  updatedAt: string;
}

// Interface for the actual API response
export interface ApiTodoResponse {
  id: string;
  name: string;
  status: 'todo' | 'doing' | 'done';
  createdAt: number;
  updatedAt: number;
}

export const todoApiSlice = createApi({
  reducerPath: 'todoApi',
  baseQuery: fetchBaseQuery({
    //Can be hiden in .env file
    baseUrl: 'https://68ad68b4a0b85b2f2cf33821.mockapi.io/crm/todo',
  }),
  tagTypes: ['Todo'],
  endpoints: (builder) => ({
    // Get all todos
    getAllTodos: builder.query<Todo[], void>({
      query: () => '',
      transformResponse: (response: ApiTodoResponse[]) => {
        // Transform API response to match our Todo interface
        return response.map((todo) => ({
          id: todo.id,
          name: todo.name,
          status: todo.status,
          createdAt: new Date(todo.createdAt * 1000).toISOString(),
          updatedAt: new Date(todo.updatedAt * 1000).toISOString(),
        }));
      },
      providesTags: ['Todo'],
    }),

    // Create todo
    createTodo: builder.mutation<Todo, string>({
      query: (text) => ({
        url: '',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          name: text,
          status: 'todo',
        },
      }),
      transformResponse: (response: ApiTodoResponse) => ({
        id: response.id,
        name: response.name,
        status: response.status,
        createdAt: new Date(response.createdAt * 1000).toISOString(),
        updatedAt: new Date(response.updatedAt * 1000).toISOString(),
      }),
      invalidatesTags: ['Todo'],
    }),

    // Update todo status
    updateTodoStatus: builder.mutation<
      Todo,
      { id: string; status: Todo['status'] }
    >({
      query: ({ id, status }) => ({
        url: `/${id}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: { status },
      }),
      transformResponse: (response: ApiTodoResponse) => ({
        id: response.id,
        name: response.name,
        status: response.status,
        createdAt: new Date(response.createdAt * 1000).toISOString(),
        updatedAt: new Date(response.updatedAt * 1000).toISOString(),
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Todo', id }],
    }),

    // Update todo text
    updateTodoText: builder.mutation<Todo, { id: string; text: string }>({
      query: ({ id, text }) => ({
        url: `/${id}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: { name: text },
      }),
      transformResponse: (response: ApiTodoResponse) => ({
        id: response.id,
        name: response.name,
        status: response.status,
        createdAt: new Date(response.createdAt * 1000).toISOString(),
        updatedAt: new Date(response.updatedAt * 1000).toISOString(),
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Todo', id }],
    }),

    // Delete todo
    deleteTodo: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Todo'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetAllTodosQuery,
  useCreateTodoMutation,
  useUpdateTodoStatusMutation,
  useUpdateTodoTextMutation,
  useDeleteTodoMutation,
} = todoApiSlice;
