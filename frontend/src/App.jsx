import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { StatsProvider } from './context/StatsContext';
import { NotificacionesProvider } from './context/NotificacionesContext';
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StatsProvider>
          <NotificacionesProvider>
            <AppRoutes />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </NotificacionesProvider>
        </StatsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;