// import React, { useState } from "react";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { auth, db } from "../firebase/firebase";
// import { useNavigate, Link } from "react-router-dom";
// import "./Login.css";
// import logo from "./logo1.png"; // <-- Correct import of image from same folder

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("nurse");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     setError("");

//     if (!email || !password || !role) {
//       setError("Please fill in all fields.");
//       return;
//     }

//     try {
//       // Firebase login
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const uid = userCredential.user.uid;
//       const handleSignIn = async () => {
//         try {
//           await signInWithEmailAndPassword(auth, email, password);
//         } catch (error) {
//           console.error('Sign in error:', error);
//         }
//       };

//       // Fetch user data from Firestore
//       const userRef = doc(db, "users", uid);
//       const userSnap = await getDoc(userRef);

//       if (!userSnap.exists()) {
//         setError("User data not found in Firestore.");
//         return;
//       }

//       const userData = userSnap.data();

//       if (userData.role !== role) {
//         setError(`You are not registered as a ${role}.`);
//         return;
//       }

//       // Redirect based on role
//       switch (role) {
//         case "nurse":
//           navigate("/nurse-dashboard");
//           break;
//         case "doctor":
//           navigate("/doctor-dashboard");
//           break;
//         case "middleman":
//           navigate("/middleman-dashboard");
//           break;
//         default:
//           setError("Invalid role selected.");
//       }

//     } catch (err) {
//       setError("Login failed: " + err.message);
//     }
//   };

//   return (
//     <div className="login-container">
//       <img src={logo} alt="App Logo" className="login-logo" />
//       <p className="login-description">
//   Brainline is an initiative by Purva Medical Trust focused on raising awareness about brain stroke prevention. Our mission is rooted in the AAA principle — Awareness, Access, and Affordability — ensuring timely action and informed choices to avoid strokes altogether.
// </p>


//       <select
//         className="login-input"
//         value={role}
//         onChange={(e) => setRole(e.target.value)}
//       >
//         <option value="nurse">Nurse</option>
//         <option value="doctor">Doctor</option>
//         <option value="middleman">Middleman</option>
//       </select>

//       <input
//         type="email"
//         placeholder="Email"
//         className="login-input"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />

//       <input
//         type="password"
//         placeholder="Password"
//         className="login-input"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />

//       {error && <div className="login-error">{error}</div>}

//       <button className="login-button" onClick={handleLogin}>
//         Login
//       </button>
// {/* 
//       <div className="login-links">
//         <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
//         <p>
//           Don’t have an account? <Link to="/SignUp">Sign Up</Link>
//         </p>
//       </div> */}
//     </div>
//   );
// };

// export default Login;
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { useNavigate, Link } from "react-router-dom";
import logo from "./logo1.png"; // <-- Correct import of image from same folder

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("nurse");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    if (!email || !password || !role) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      // Firebase login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      const handleSignIn = async () => {
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
          console.error('Sign in error:', error);
        }
      };

      // Fetch user data from Firestore
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setError("User data not found in Firestore.");
        return;
      }

      const userData = userSnap.data();

      if (userData.role !== role) {
        setError(`You are not registered as a ${role}.`);
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
          setError("Invalid role selected.");
      }

    } catch (err) {
      setError("Login failed: " + err.message);
    }
  };

  return (
    <>
    {/* Tailwind CSS CDN */}
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet" />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Section - Branding & Information */}
        <div className="hidden lg:block space-y-8 px-8">
          {/* Logo and Brand Header */}
          <div className="text-center lg:text-left">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 mb-8">
              {/* Logo */}
              <div className="flex-shrink-0">
                <img 
                  src={logo} 
                  alt="Brainline Logo" 
                  className="w-16 h-16 lg:w-20 lg:h-20 object-contain"
                />
              </div>

              {/* Brand Text */}
              <div className="text-center lg:text-left">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-2 leading-tight">
                  Brainline
                </h1>
                <h2 className="text-xl lg:text-2xl font-semibold text-gray-600">
                  Purva Medical Trust
                </h2>
              </div>
            </div>
          </div>

          {/* Additional content can go here */}
          <div className="space-y-6">
            {/* You can add more sections here like description, features, etc. */}
          </div>
      

            {/* Mission Statement */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-blue-500">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Brainline is an initiative by Purva Medical Trust focused on raising awareness about brain stroke prevention. Our mission is rooted in the AAA principle — Awareness, Access, and Affordability — ensuring timely action and informed choices to avoid strokes altogether.
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">A</div>
                  <div className="text-sm text-gray-600">Awareness</div>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-600">A</div>
                  <div className="text-sm text-gray-600">Access</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">A</div>
                  <div className="text-sm text-gray-600">Affordability</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Login Form */}
          <div className="w-full max-w-md mx-auto lg:max-w-lg">
            <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10">
              
              {/* Mobile Header - Fixed Layout */}
              <div className="lg:hidden text-center mb-8">
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0">
                    <img 
                      src={logo} 
                      alt="Brainline Logo" 
                      className="w-16 h-16 lg:w-20 lg:h-20 object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                      Brainline
                    </h1>
                    <h2 className="text-lg font-semibold text-gray-600">
                      Purva Medical Trust
                    </h2>
                  </div>
                </div>
              </div>

              {/* Login Form Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Please Sign In
                </h3>
              </div>

              {/* Login Form */}
              <div className="space-y-6">
                {/* Role Selection */}
                <div>
                  <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Role
                  </label>
                  <select
                    id="role"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-gray-700"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="nurse">Nurse</option>
                    <option value="doctor">Doctor</option>
                    <option value="middleman">Middleman</option>
                  </select>
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Login Button */}
                <button
                  onClick={handleLogin}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold text-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;