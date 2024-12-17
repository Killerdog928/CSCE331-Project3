import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./AuthContext";
import Callback from "./callback/page.tsx";
import Home from "./page";
import Protected from "./protected";

/**
 * The main application component that sets up the authentication provider,
 * router, and routes for the application.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * // Usage example:
 * <App />
 *
 * @remarks
 * This component uses the `AuthProvider` to wrap the application with
 * authentication context. It also sets up the `Router` with three routes:
 * - `/` which renders the `Home` component
 * - `/callback` which renders the `Callback` component
 * - `/protected` which renders the `Protected` component
 */
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<Callback />} path="/callback" />
          <Route element={<Protected />} path="/protected" />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
