import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";

/*
This component protects routes that should only be visible
to logged-in users.
*/
function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  /*
  This checks the current login state.
  While Firebase is still checking, it shows a loading message.
  */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return <div style={{ padding: 16 }}>Loading...</div>;

  // If no user is logged in, send them to the login page
  if (!user) return <Navigate to="/login" replace />;

  // If logged in, allow access to the protected page
  return children;
}

export default function App() {
  /*
  This effect handles automatic logout after 5 minutes
  of no user activity.
  */
  useEffect(() => {
    let timeoutId;

    // Starts or restarts the inactivity timer
    const startTimer = () => {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(async () => {
        if (auth.currentUser) {
          try {
            await signOut(auth);
            alert("Session expired after 5 minutes of inactivity.");
          } catch (error) {
            console.error("Auto logout failed:", error);
          }
        }
      }, 5 * 60 * 1000);
    };

    // Resets timer whenever user is active
    const resetTimer = () => {
      if (auth.currentUser) {
        startTimer();
      }
    };

    // Adds activity listeners while user is logged in
    const addActivityListeners = () => {
      window.addEventListener("mousemove", resetTimer);
      window.addEventListener("keydown", resetTimer);
      window.addEventListener("click", resetTimer);
      window.addEventListener("scroll", resetTimer);
    };

    // Removes activity listeners when user logs out
    const removeActivityListeners = () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("scroll", resetTimer);
    };

    /*
    This watches for login/logout changes.
    If logged in, the timeout starts.
    If logged out, the timer and listeners are removed.
    */
    const unsub = onAuthStateChanged(auth, (user) => {
      clearTimeout(timeoutId);
      removeActivityListeners();

      if (user) {
        startTimer();
        addActivityListeners();
      }
    });

    return () => {
      clearTimeout(timeoutId);
      removeActivityListeners();
      unsub();
    };
  }, []);

  return (
    <Routes>
      {/* Public login route */}
      <Route path="/login" element={<Login />} />

      {/* Public registration route */}
      <Route path="/register" element={<Register />} />

      {/* Protected home route */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* Catch-all route redirects unknown paths to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}