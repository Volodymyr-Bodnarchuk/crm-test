import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ClipboardList } from 'lucide-react';

import TodoItem from './todo-item';
import clsx from 'clsx';
import type { Todo } from '../../store/todo-api-slice';

interface TodoColumnProps {
  title: string;
  status: Todo['status'];
  todos: Todo[];
  color: string;
  onOptimisticTextUpdate: (todoId: string, newText: string) => void;
  onClearOptimisticTextUpdate: (todoId: string) => void;
}

const TodoColumn = ({
  title,
  status,
  todos,
  color,
  onOptimisticTextUpdate,
  onClearOptimisticTextUpdate,
}: TodoColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      type: 'column',
      status,
    },
  });

  return (
    <div className='flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex flex-col'>
      {/* Column Header */}
      <div className='mb-6'>
        <div className={`inline-block bg-gradient-to-r ${color} bg-clip-text`}>
          <h2 className='text-2xl font-black text-transparent tracking-tight'>
            {title}
          </h2>
        </div>
        <div className={`w-12 h-1 bg-gradient-to-r ${color} mt-2`}></div>
        <div className='text-gray-400 text-sm font-medium mt-2'>
          {todos.length} {todos.length === 1 ? 'task' : 'tasks'}
        </div>
      </div>

      {/* Drop Zone */}
      <div
        ref={setNodeRef}
        className={clsx(
          `flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 min-h-[400px] transition-all duration-300`,
          isOver
            ? {
                'bg-white/10 border-white/30 ring-2 ring-purple-500/50':
                  status === 'todo',
                'bg-white/10 border-white/30 ring-2 ring-orange-500/50':
                  status === 'doing',
                'bg-white/10 border-white/30 ring-2 ring-emerald-500/50':
                  status === 'done',
              }
            : ''
        )}
      >
        <SortableContext
          items={todos.map((todo) => todo.id)}
          strategy={verticalListSortingStrategy}
        >
          {todos.length > 0 ? (
            todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onOptimisticTextUpdate={onOptimisticTextUpdate}
                onClearOptimisticTextUpdate={onClearOptimisticTextUpdate}
              />
            ))
          ) : (
            <div className='flex flex-col items-center justify-center h-full text-gray-400'>
              <ClipboardList className='w-8 h-8 mb-4 opacity-50' />
              {status === 'todo' ? (
                <p className='text-sm opacity-75'>No created tasks yet</p>
              ) : null}
              <p className='text-sm opacity-75'>
                {status === 'doing' ? 'Drag tasks here to get going' : null}
                {status === 'done' ? "Drag tasks here if it's done" : null}
              </p>
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
};

export default TodoColumn;
