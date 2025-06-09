import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { Link } from "react-router-dom";  // <-- Import Link from react-router-dom
import "./SignUp.css";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("nurse");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignUp = async () => {
    setError("");
    setSuccess("");

    if (!email || !password || !role) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData = {
        email,
        role,
        createdAt: new Date(),
      };

      await setDoc(doc(db, "users", user.uid), userData);

      setSuccess("User registered successfully!");
      setEmail("");
      setPassword("");
      setRole("nurse");
    } catch (err) {
      setError("Sign up failed: " + err.message);
    }
  };

  return (
    <div className="signup-container">
      <img src="/logo.png" alt="App Logo" className="signup-logo" />
      <h2 className="signup-title">Create Account</h2>

      <select
        className="signup-input"
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
        className="signup-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="signup-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <div className="signup-error">{error}</div>}
      {success && <div className="signup-success">{success}</div>}

      <button className="signup-button" onClick={handleSignUp}>
        Register
      </button>

      <p className="signup-login-text">
        Already have an account?{" "}
        <Link to="/login" className="signup-login-link">
          Login
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
