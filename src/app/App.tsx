import { RouterProvider } from 'react-router-dom';
import { AppProviders } from './providers';
import { router } from './router';
import { ToastContainer } from 'react-toastify';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import 'react-toastify/dist/ReactToastify.css';

export function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <RouterProvider router={router} />
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AppProviders>
    </ErrorBoundary>
  );
}
