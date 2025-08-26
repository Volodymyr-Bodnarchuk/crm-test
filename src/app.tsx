import { Provider } from 'react-redux';
import { store } from './store/store';
import TodoInput from './components/todo/todo-input';
import TodoBoard from './components/todo/todo-board';

function App() {
  return (
    <Provider store={store}>
      <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black'>
        <div className='container mx-auto px-4 py-8'>
          <header className='text-center mb-12'>
            <div className='inline-block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text'>
              <h1 className='text-6xl font-black text-transparent mb-4 tracking-tight'>
                Task Master
              </h1>
            </div>
            <div className='w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mb-8'></div>
            <TodoInput />
          </header>

          <div className='max-w-7xl mx-auto'>
            <TodoBoard />
          </div>

          <footer className='text-center mt-16'>
            <div className='text-gray-400 text-sm font-light tracking-wider uppercase'>
              Built with passion
            </div>
          </footer>
        </div>
      </div>
    </Provider>
  );
}

export default App;
