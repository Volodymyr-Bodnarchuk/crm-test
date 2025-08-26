import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  useUpdateTodoTextMutation,
  useDeleteTodoMutation,
  type Todo,
} from '../../store/todo-api-slice';
import { Edit, Trash2 } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onOptimisticTextUpdate: (todoId: string, newText: string) => void;
  onClearOptimisticTextUpdate: (todoId: string) => void;
}

const TodoItem = ({
  todo,
  onOptimisticTextUpdate,
  onClearOptimisticTextUpdate,
}: TodoItemProps) => {
  const [updateTodoText] = useUpdateTodoTextMutation();
  const [deleteTodo] = useDeleteTodoMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.name);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: todo.id,
    data: {
      type: 'todo-item',
      todo,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = async () => {
    try {
      await deleteTodo(todo.id).unwrap();
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const handleEdit = async () => {
    if (editText.trim() && editText !== todo.name) {
      // Apply optimistic update immediately
      onOptimisticTextUpdate(todo.id, editText.trim());

      try {
        await updateTodoText({ id: todo.id, text: editText.trim() }).unwrap();
        setIsEditing(false);
      } catch (error) {
        console.error('Failed to update todo:', error);
        onClearOptimisticTextUpdate(todo.id);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setEditText(todo.name);
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 mb-3 cursor-grab active:cursor-grabbing hover:bg-white/10 hover:border-white/20 transition-all duration-300 group'
    >
      <div className='flex items-start justify-between'>
        <div className='flex-1 min-w-0'>
          {isEditing ? (
            <input
              type='text'
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleEdit}
              onKeyDown={handleKeyPress}
              className='w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
              autoFocus
            />
          ) : (
            <div className='flex items-start space-x-3'>
              <div
                className={`w-3 h-3 bg-gradient-to-r ${getStatusColor(
                  todo.status
                )} rounded-full mt-2 flex-shrink-0`}
              ></div>
              <div className='flex-1 min-w-0'>
                <p className='text-white font-medium leading-relaxed break-words'>
                  {todo.name}
                </p>
                <div className='flex items-center mt-2 space-x-2'>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-gradient-to-r ${getStatusColor(
                      todo.status
                    )} text-white`}
                  >
                    {getStatusText(todo.status)}
                  </span>
                  <span className='text-xs text-gray-400'>
                    {new Date(todo.createdAt).toLocaleDateString()} -{' '}
                    {new Date(todo.createdAt).getHours()}:
                    {new Date(todo.createdAt).getMinutes()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {!isEditing && (
          <div className='flex items-center space-x-2 ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
            <button
              onClick={() => setIsEditing(true)}
              className='text-blue-400 hover:text-blue-300 p-1 rounded transition-colors duration-200'
            >
              <Edit className='w-4 h-4' />
            </button>
            <button
              onClick={handleDelete}
              className='text-red-400 hover:text-red-300 p-1 rounded transition-colors duration-200'
            >
              <Trash2 className='w-4 h-4' />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoItem;

const getStatusColor = (status: Todo['status']) => {
  switch (status) {
    case 'todo':
      return 'from-blue-500 to-purple-500';
    case 'doing':
      return 'from-orange-500 to-red-500';
    case 'done':
      return 'from-green-500 to-emerald-500';
    default:
      return 'from-gray-500 to-gray-600';
  }
};

const getStatusText = (status: Todo['status']) => {
  switch (status) {
    case 'todo':
      return 'TODO';
    case 'doing':
      return 'DOING';
    case 'done':
      return 'DONE';
    default:
      return 'UNKNOWN';
  }
};
