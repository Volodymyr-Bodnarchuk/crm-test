import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import {
  type Todo,
  useGetAllTodosQuery,
  useUpdateTodoStatusMutation,
} from '../../store/todo-api-slice';
import { ErrorAlert } from '../error-alert.component';
import { Loader } from '../loader.components';
import TodoColumn from './todo-column';

const TodoBoard = () => {
  const { data: todos = [], isLoading, error, refetch } = useGetAllTodosQuery();
  const [updateTodoStatus] = useUpdateTodoStatusMutation();
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null);
  const [optimisticUpdates, setOptimisticUpdates] = useState<
    Map<string, { status?: Todo['status']; name?: string }>
  >(new Map());

  // Apply optimistic updates to todos
  const displayTodos = todos.map((todo) => {
    const optimisticUpdate = optimisticUpdates.get(todo.id);
    if (optimisticUpdate) {
      return {
        ...todo,
        ...(optimisticUpdate.status && { status: optimisticUpdate.status }),
        ...(optimisticUpdate.name && { name: optimisticUpdate.name }),
        updatedAt: new Date().toISOString(),
      };
    }
    return todo;
  });

  // Clear optimistic updates when API data changes
  useEffect(() => {
    if (todos.length > 0) {
      setOptimisticUpdates((prev) => {
        const newMap = new Map(prev);

        // Only clear optimistic updates for todos that have been updated in the API
        todos.forEach((apiTodo) => {
          const optimisticUpdate = newMap.get(apiTodo.id);
          if (optimisticUpdate) {
            // Check if the API data matches our optimistic update
            if (
              optimisticUpdate.status &&
              apiTodo.status === optimisticUpdate.status
            ) {
              // Status matches, clear the status optimistic update
              const updatedOptimistic = { ...optimisticUpdate };
              delete updatedOptimistic.status;
              if (Object.keys(updatedOptimistic).length === 0) {
                newMap.delete(apiTodo.id);
              } else {
                newMap.set(apiTodo.id, updatedOptimistic);
              }
            }
            if (
              optimisticUpdate.name &&
              apiTodo.name === optimisticUpdate.name
            ) {
              // Name matches, clear the name optimistic update
              const updatedOptimistic = { ...optimisticUpdate };
              delete updatedOptimistic.name;
              if (Object.keys(updatedOptimistic).length === 0) {
                newMap.delete(apiTodo.id);
              } else {
                newMap.set(apiTodo.id, updatedOptimistic);
              }
            }
          }
        });

        return newMap;
      });
    }
  }, [todos]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const todo = displayTodos.find((t) => t.id === event.active.id);
    setActiveTodo(todo || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTodo(null);

    if (over && active.id !== over.id) {
      // Check if the drop target is a valid column status
      const validStatuses: Todo['status'][] = ['todo', 'doing', 'done'];
      const newStatus = over.id as Todo['status'];

      if (!validStatuses.includes(newStatus)) {
        return;
      }

      const todoId = active.id as string;

      const todoToUpdate = displayTodos.find((t) => t.id === todoId);
      if (!todoToUpdate) return;

      if (todoToUpdate.status === newStatus) {
        return;
      }

      // Set optimistic update immediately
      setOptimisticUpdates((prev) =>
        new Map(prev).set(todoId, { status: newStatus })
      );

      try {
        await updateTodoStatus({ id: todoId, status: newStatus }).unwrap();
      } catch {
        setOptimisticUpdates((prev) => {
          const newMap = new Map(prev);
          newMap.delete(todoId);
          return newMap;
        });
      }
    }
  };

  // Handles optimistic text updates
  const handleOptimisticTextUpdate = (todoId: string, newText: string) => {
    setOptimisticUpdates((prev) => {
      const current = prev.get(todoId) || {};
      return new Map(prev).set(todoId, { ...current, name: newText });
    });
  };

  // Clears optimistic text update
  const clearOptimisticTextUpdate = (todoId: string) => {
    setOptimisticUpdates((prev) => {
      const newMap = new Map(prev);
      const current = newMap.get(todoId);
      if (current) {
        const updatedOptimistic = { ...current };
        delete updatedOptimistic.name;
        if (Object.keys(updatedOptimistic).length === 0) {
          newMap.delete(todoId);
        } else {
          newMap.set(todoId, updatedOptimistic);
        }
      }
      return newMap;
    });
  };

  const todoTodos = displayTodos.filter((todo) => todo.status === 'todo');
  const doingTodos = displayTodos.filter((todo) => todo.status === 'doing');
  const doneTodos = displayTodos.filter((todo) => todo.status === 'done');

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorAlert refetch={refetch} />;
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 h-full'>
        <TodoColumn
          title='To Do'
          status='todo'
          todos={todoTodos}
          color='from-blue-500 to-purple-500'
          onOptimisticTextUpdate={handleOptimisticTextUpdate}
          onClearOptimisticTextUpdate={clearOptimisticTextUpdate}
        />
        <TodoColumn
          title='Doing'
          status='doing'
          todos={doingTodos}
          color='from-orange-500 to-red-500'
          onOptimisticTextUpdate={handleOptimisticTextUpdate}
          onClearOptimisticTextUpdate={clearOptimisticTextUpdate}
        />
        <TodoColumn
          title='Done'
          status='done'
          todos={doneTodos}
          color='from-green-500 to-emerald-500'
          onOptimisticTextUpdate={handleOptimisticTextUpdate}
          onClearOptimisticTextUpdate={clearOptimisticTextUpdate}
        />
      </div>

      <DragOverlay>
        {activeTodo ? (
          <div className='bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 shadow-2xl transform rotate-3 scale-105'>
            <div className='flex items-start space-x-3'>
              <div
                className={clsx(
                  'w-3 h-3 bg-gradient-to-r rounded-full mt-2 flex-shrink-0',
                  activeTodo.status === 'todo' && 'from-blue-500 to-purple-500',
                  activeTodo.status === 'doing' && 'from-orange-500 to-red-500',
                  activeTodo.status === 'done' &&
                    'from-green-500 to-emerald-500'
                )}
              ></div>
              <div className='flex-1'>
                <p className='text-white font-medium leading-relaxed'>
                  {activeTodo.name}
                </p>
                <div className='flex items-center mt-2 space-x-2'>
                  <span
                    className={clsx(
                      'text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full text-white',
                      activeTodo.status === 'todo' &&
                        'bg-gradient-to-r from-blue-500 to-purple-500',
                      activeTodo.status === 'doing' &&
                        'bg-gradient-to-r from-orange-500 to-red-500',
                      activeTodo.status === 'done' &&
                        'bg-gradient-to-r from-green-500 to-emerald-500'
                    )}
                  >
                    {activeTodo.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default TodoBoard;
