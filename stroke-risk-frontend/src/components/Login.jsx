import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("nurse");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    if (!email || !password || !role) {
      setError(" Please fill in all fields.");
      return;
    }

    try {
      // Firebase login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Fetch user data from Firestore
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setError(" User data not found in Firestore.");
        return;
      }

      const userData = userSnap.data();

      if (userData.role !== role) {
        setError(` You are not registered as a ${role}.`);
        return;
      }

      // Redirect based on role
      switch (role) {
        case "nurse":
          navigate("/nurse-dashboard");
          break;
        case "doctor":
          navigate("/doctor-dashboard");
          break;
        case "middleman":
          navigate("/middleman-dashboard");
          break;
        default:
          setError(" Invalid role selected.");
      }

    } catch (err) {
      setError(" Login failed: " + err.message);
    }
  };

  return (
    <div className="login-container">
      <img src="/logo.png" alt="App Logo" className="login-logo" />
      <h2 className="login-title">Welcome Back</h2>

      <select
        className="login-input"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="nurse">Nurse</option>
        <option value="doctor">Doctor</option>
        <option value="middleman">Middleman</option>
      </select>

      <input
        type="email"
        placeholder="Email"
        className="login-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="login-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <div className="login-error">{error}</div>}

      <button className="login-button" onClick={handleLogin}>
        Login
      </button>

      <div className="login-links">
        <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
        <p>
          Don’t have an account? <Link to="/SignUp">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
