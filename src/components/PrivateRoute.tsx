import { Navigate, useLocation } from 'react-router-dom';
import { isVerified } from '../utils/auth';

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const publicPaths = ['/verify', '/set-verified'];
  
  // If it's not a public path and user is not verified
  if (!publicPaths.includes(location.pathname) && !isVerified()) {
    // Store the path user was trying to access
    localStorage.setItem('intendedPath', location.pathname + location.search);
    return <Navigate to="/verify" replace />;
  }

  // If user is verified but tries to access verify pages, redirect to home
  if (publicPaths.includes(location.pathname) && isVerified()) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};
