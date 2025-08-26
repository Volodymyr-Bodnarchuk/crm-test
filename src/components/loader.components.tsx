export const Loader = () => {
  return (
    <div className='flex flex-col items-center justify-center py-12'>
      <div className='relative'>
        <div className='w-16 h-16 border-4 border-white/20 border-t-orange-500 rounded-full animate-spin'></div>
        <div
          className='absolute inset-0 w-16 h-16 border-4 border-transparent border-t-red-500 rounded-full animate-spin'
          style={{ animationDelay: '0.5s' }}
        ></div>
      </div>
      <span className='mt-6 text-gray-300 font-medium tracking-wider uppercase'>
        Loading todos...
      </span>
    </div>
  );
};
