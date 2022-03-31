import { Navigate, Route, Routes } from 'react-router-dom';

import FilmDetatailsScreen from './Pages/FilmDetatailsScreen';
import LoginScreen from './Pages/LoginScreen';
import UserDetails from './Pages/UserDetails';
import Protected from './components/Protected';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route
        path="/user-details"
        element={
          <Protected>
            <UserDetails />
          </Protected>
        }
      />
      <Route
        path="/film/:title"
        element={
          <Protected>
            <FilmDetatailsScreen />
          </Protected>
        }
      />
      <Route path="/" element={<LoginScreen />} />
      <Route path="*" element={<LoginScreen />} />
    </Routes>
  );
}

export default App;
