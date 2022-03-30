import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const Protected = ({ children }) => {
  const { username, isLoggedIn } = useSelector(state => state.user);

  if (!username && !isLoggedIn) return <Navigate to="/login" />;

  return children;
};

export default Protected;
