import { useAuth } from "./AuthContext";

/**
 * Protected component that checks if the user is authenticated.
 * If the user is not authenticated, it displays an "Access Denied" message.
 * If the user is authenticated, it displays a welcome message.
 *
 * @returns {JSX.Element} The rendered component based on authentication status.
 */
const Protected = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <h1>Access Denied</h1>;
  }

  return <h1>Welcome to the Protected Page!</h1>;
};

export default Protected;
