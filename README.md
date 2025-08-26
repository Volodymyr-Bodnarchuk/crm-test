# React + Vite + TypeScript + Tailwind CSS + RTK Query

A modern React application built with Vite, TypeScript, Tailwind CSS, and RTK Query for efficient state management and API calls.

## 🚀 Features

- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for utility-first styling
- **RTK Query** for efficient API state management
- **Redux Toolkit** for global state management
- **Modern UI** with responsive design
- **Error handling** and loading states
- **Form validation** and user feedback

## 📦 Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Redux Toolkit
- RTK Query
- React Redux

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd crm-test
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── PostsList.tsx   # Displays list of posts with RTK Query
│   └── CreatePostForm.tsx # Form for creating new posts
├── store/              # Redux store configuration
│   ├── store.ts        # Redux store setup
│   ├── api.ts          # RTK Query API slice
│   └── hooks.ts        # Typed Redux hooks
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles with Tailwind
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 RTK Query Features

The application demonstrates several RTK Query features:

### Queries
- `useGetPostsQuery()` - Fetch all posts
- `useGetPostQuery(id)` - Fetch single post by ID
- `useGetUsersQuery()` - Fetch all users

### Mutations
- `useCreatePostMutation()` - Create new post
- `useUpdatePostMutation()` - Update existing post
- `useDeletePostMutation()` - Delete post

### Features
- Automatic caching and cache invalidation
- Loading and error states
- Optimistic updates
- Background refetching
- Request deduplication

## 🎨 Tailwind CSS

The application uses Tailwind CSS for styling with:
- Responsive design
- Modern UI components
- Hover effects and transitions
- Custom color scheme
- Utility-first approach

## 🔄 API Integration

The app integrates with [JSONPlaceholder](https://jsonplaceholder.typicode.com/) API for demonstration purposes. You can easily modify the `baseUrl` in `src/store/api.ts` to connect to your own API.

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🚀 Getting Started with Development

1. **Adding new API endpoints**: Modify `src/store/api.ts`
2. **Creating new components**: Add to `src/components/`
3. **Styling**: Use Tailwind classes or add custom CSS
4. **State management**: Use RTK Query for API state, Redux for global state

## 📝 Example Usage

### Using RTK Query Hooks

```typescript
import { useGetPostsQuery, useCreatePostMutation } from './store/api';

function MyComponent() {
  const { data: posts, isLoading, error } = useGetPostsQuery();
  const [createPost] = useCreatePostMutation();

  const handleCreatePost = async (postData) => {
    try {
      await createPost(postData).unwrap();
      // Post created successfully
    } catch (error) {
      // Handle error
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading posts</div>;

  return (
    <div>
      {posts?.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
