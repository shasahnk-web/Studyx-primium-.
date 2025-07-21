import { Navigate } from 'react-router-dom';
import { isVerified } from '../utils/auth';

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isVerified()) {
    return <Navigate to="/verify" replace />;
  }

  return <>{children}</>;
};
