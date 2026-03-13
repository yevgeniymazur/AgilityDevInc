import { useState, useEffect } from "react";
import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence
} from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  // Stores form input values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Stores any login error messages
  const [error, setError] = useState("");

  /*
  This effect checks if a user is already logged in.
  If a session exists, it redirects the user to the Home page.
  */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/");
    });

    return () => unsubscribe();
  }, [navigate]);

  /*
  Handles email/password login.
  Session persistence is set so the login survives page refresh
  but ends when the browser session closes.
  */
  async function handleEmailLogin(e) {
    e.preventDefault();
    setError("");

    try {
      await setPersistence(auth, browserSessionPersistence);

      await signInWithEmailAndPassword(auth, email, password);

      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  /*
  Handles Google login using Firebase popup authentication.
  Also applies session persistence for the login session.
  */
  async function handleGoogleLogin() {
    setError("");

    try {
      const provider = new GoogleAuthProvider();

      await setPersistence(auth, browserSessionPersistence);

      await signInWithPopup(auth, provider);

      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container">

      {/* Accessibility link to skip navigation */}
      <a className="skip-link" href="#main">Skip to content</a>

      {/* Login Card Container */}
      <main id="main" className="card" style={{ maxWidth: 520, margin: "40px auto" }}>

        {/* App title and security badge */}
        <div className="header">
          <div>
            <h1>Wanderloom</h1>
            <span className="badge">Secure login</span>
          </div>
        </div>

        <h2>Login</h2>

        {/* Google login button */}
        <button className="primary" onClick={handleGoogleLogin} type="button">
          Continue with Google
        </button>

        <hr />

        {/* Email/password login form */}
        <form onSubmit={handleEmailLogin} aria-describedby={error ? "login-error" : undefined}>

          {/* Email input */}
          <div style={{ marginBottom: 12 }}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password input */}
          <div style={{ marginBottom: 12 }}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Login submit button */}
          <button className="primary" type="submit">
            Login
          </button>

          {/* Displays login errors */}
          {error && (
            <p
              id="login-error"
              className="error"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </p>
          )}

        </form>

        {/* Link to registration page */}
        <p style={{ marginTop: 14 }}>
          Don’t have an account? <Link to="/register">Register</Link>
        </p>

      </main>
    </div>
  );
}