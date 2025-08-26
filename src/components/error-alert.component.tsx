import type { FC } from 'react';
import { AlertCircle } from 'lucide-react';

type ErrorAlertProps = {
  refetch: () => void;
};

export const ErrorAlert: FC<ErrorAlertProps> = ({ refetch }) => {
  return (
    <div className='text-center py-12'>
      <div className='w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6'>
        <AlertCircle className='w-8 h-8 text-white' />
      </div>
      <div className='text-red-400 font-bold text-lg mb-4'>
        Error loading todos
      </div>
      <p className='text-gray-400 mb-6'>Please try again</p>
      <button
        onClick={() => refetch()}
        className='bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-wider hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105'
      >
        Retry
      </button>
    </div>
  );
};
