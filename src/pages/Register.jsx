import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  // Form input state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // Stores any registration errors
  const [error, setError] = useState("");

  /*
  Check if a user is already logged in.
  If a session exists we redirect them to the home page
  instead of allowing them to register again.
  */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) navigate("/");
    });

    return () => unsub();
  }, [navigate]);

  /*
  Handles user registration with Firebase Authentication.
  After the account is created we also create a Firestore
  document to store user profile information.
  */
  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    // Basic validation to ensure passwords match
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Create user in Firebase Authentication
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      /*
      Create a user document in Firestore.
      This allows us to store user-related data later
      such as preferences, saved trips, uploaded images, etc.
      */
      await setDoc(doc(db, "users", cred.user.uid), {
        email: cred.user.email,
        createdAt: serverTimestamp(),
      });

      // After successful registration redirect to Home
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "80px auto", padding: 20 }}>
      <h1>Wanderloom</h1>
      <h2>Create account</h2>

      {/* Registration form */}
      <form
        onSubmit={handleRegister}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >

        {/* Email input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        {/* Password input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />

        {/* Confirm password input */}
        <input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          autoComplete="new-password"
        />

        {/* Submit registration button */}
        <button type="submit" style={{ padding: 10, cursor: "pointer" }}>
          Register
        </button>
      </form>

      {/* Display registration error messages */}
      {error && (
        <p style={{ color: "crimson", marginTop: 12, wordBreak: "break-word" }}>
          {error}
        </p>
      )}

      {/* Link back to login page */}
      <p style={{ marginTop: 16, fontSize: 14 }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}