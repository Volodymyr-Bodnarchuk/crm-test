import { useState } from 'react';
import { useCreateTodoMutation } from '../../store/todo-api-slice';
import { Plus, Loader2, Check } from 'lucide-react';

const TodoInput = () => {
  const [text, setText] = useState('');
  const [createTodo, { isLoading: isCreating }] = useCreateTodoMutation();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isCreating) return;

    try {
      await createTodo(text.trim()).unwrap();
      setText('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  };

  return (
    <div className='w-full max-w-2xl mx-auto mb-8'>
      <form onSubmit={handleSubmit} className='relative'>
        <input
          type='text'
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='What needs to be done?'
          className='w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-lg'
          disabled={isCreating}
        />
        <button
          type='submit'
          disabled={isCreating || !text.trim()}
          className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white w-10 h-10 rounded-lg font-bold hover:from-orange-600 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center'
        >
          {isCreating ? (
            <Loader2 className='w-5 h-5 animate-spin' />
          ) : showSuccess ? (
            <Check className='w-6 h-6 text-green-400' />
          ) : (
            <Plus className='w-6 h-6' />
          )}
        </button>
      </form>
    </div>
  );
};

export default TodoInput;
