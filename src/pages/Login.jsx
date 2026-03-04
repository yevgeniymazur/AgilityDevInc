import { useState, useEffect } from "react";
import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/");
    });
    return () => unsubscribe();
  }, [navigate]);

  async function handleEmailLogin(e) {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container">
      <a className="skip-link" href="#main">Skip to content</a>

      <main id="main" className="card" style={{ maxWidth: 520, margin: "40px auto" }}>
        <div className="header">
          <div>
            <h1>Wanderloom</h1>
            <span className="badge">Secure login</span>
          </div>
        </div>

        <h2>Login</h2>

        <button className="primary" onClick={handleGoogleLogin} type="button">
          Continue with Google
        </button>

        <hr />

        <form onSubmit={handleEmailLogin} aria-describedby={error ? "login-error" : undefined}>
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

          <button className="primary" type="submit">
            Login
          </button>

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

        <p style={{ marginTop: 14 }}>
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </main>
    </div>
  );
}