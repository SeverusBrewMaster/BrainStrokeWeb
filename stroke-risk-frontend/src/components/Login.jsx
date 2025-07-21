
// import React, { useState } from "react";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { auth, db } from "../firebase/firebase";
// import { useNavigate, Link } from "react-router-dom";
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
//     <>
//     {/* Tailwind CSS CDN */}
//     <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet" />
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-6xl mx-auto">
//         <div className="grid lg:grid-cols-2 gap-8 items-center">
          
//           {/* Left Section - Branding & Information */}
//         <div className="hidden lg:block space-y-8 px-8">
//           {/* Logo and Brand Header */}
//           <div className="text-center lg:text-left">
//             <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 mb-8">
//               {/* Logo */}
//               <div className="flex-shrink-0">
//                 <img 
//                   src={logo} 
//                   alt="Brainline Logo" 
//                   className="w-16 h-16 lg:w-20 lg:h-20 object-contain"
//                 />
//               </div>

//               {/* Brand Text */}
//               <div className="text-center lg:text-left">
//                 <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-2 leading-tight">
//                   Brainline
//                 </h1>
//                 <h2 className="text-xl lg:text-2xl font-semibold text-gray-600">
//                   Purva Medical Trust
//                 </h2>
//               </div>
//             </div>
//           </div>

//           {/* Additional content can go here */}
//           <div className="space-y-6">
//             {/* You can add more sections here like description, features, etc. */}
//           </div>
      

//             {/* Mission Statement */}
//             <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-blue-500">
//               <h3 className="text-xl font-bold text-gray-800 mb-4">Our Mission</h3>
//               <p className="text-gray-700 leading-relaxed mb-6">
//                 Brainline is an initiative by Purva Medical Trust focused on raising awareness about brain stroke prevention. Our mission is rooted in the AAA principle — Awareness, Access, and Affordability — ensuring timely action and informed choices to avoid strokes altogether.
//               </p>
//               <div className="grid grid-cols-3 gap-4 text-center">
//                 <div className="p-4 bg-blue-50 rounded-lg">
//                   <div className="text-2xl font-bold text-blue-600">A</div>
//                   <div className="text-sm text-gray-600">Awareness</div>
//                 </div>
//                 <div className="p-4 bg-indigo-50 rounded-lg">
//                   <div className="text-2xl font-bold text-indigo-600">A</div>
//                   <div className="text-sm text-gray-600">Access</div>
//                 </div>
//                 <div className="p-4 bg-purple-50 rounded-lg">
//                   <div className="text-2xl font-bold text-purple-600">A</div>
//                   <div className="text-sm text-gray-600">Affordability</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Section - Login Form */}
//           <div className="w-full max-w-md mx-auto lg:max-w-lg">
//             <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10">
              
//               {/* Mobile Header - Fixed Layout */}
//               <div className="lg:hidden text-center mb-8">
//                 <div className="flex flex-col items-center">
//                   <div className="flex-shrink-0">
//                     <img 
//                       src={logo} 
//                       alt="Brainline Logo" 
//                       className="w-16 h-16 lg:w-20 lg:h-20 object-contain"
//                     />
//                   </div>
//                   <div className="text-center">
//                     <h1 className="text-3xl font-bold text-gray-800 mb-2">
//                       Brainline
//                     </h1>
//                     <h2 className="text-lg font-semibold text-gray-600">
//                       Purva Medical Trust
//                     </h2>
//                   </div>
//                 </div>
//               </div>

//               {/* Login Form Header */}
//               <div className="text-center mb-8">
//                 <h3 className="text-2xl font-bold text-gray-800 mb-2">
//                   Please Sign In
//                 </h3>
//               </div>

//               {/* Login Form */}
//               <div className="space-y-6">
//                 {/* Role Selection */}
//                 <div>
//                   <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
//                     Select Role
//                   </label>
//                   <select
//                     id="role"
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-gray-700"
//                     value={role}
//                     onChange={(e) => setRole(e.target.value)}
//                   >
//                     <option value="nurse">Nurse</option>
//                     <option value="doctor">Doctor</option>
//                     <option value="middleman">Middleman</option>
//                   </select>
//                 </div>

//                 {/* Email Input */}
//                 <div>
//                   <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
//                     Email Address
//                   </label>
//                   <input
//                     id="email"
//                     type="email"
//                     placeholder="Enter your email"
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                   />
//                 </div>

//                 {/* Password Input */}
//                 <div>
//                   <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
//                     Password
//                   </label>
//                   <input
//                     id="password"
//                     type="password"
//                     placeholder="Enter your password"
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                   />
//                 </div>

//                 {/* Error Message */}
//                 {error && (
//                   <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
//                     {error}
//                   </div>
//                 )}

//                 {/* Login Button */}
//                 <button
//                   onClick={handleLogin}
//                   className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold text-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
//                 >
//                   Sign In
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//     </>
//   );
// };

// export default Login;
import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDocs, getDoc, setDoc, doc, collection } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import logo from "./logo1.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("nurse");
  const [error, setError] = useState("");
  const [showCampModal, setShowCampModal] = useState(false);
  const [campLocation, setCampLocation] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [availableCamps, setAvailableCamps] = useState([]);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    if (!email || !password || !role) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

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

      // ✅ Fetch all camps for all roles
      const snapshot = await getDocs(collection(db, "camps_metadata"));
      const camps = snapshot.docs.map(doc => doc.id);
      setAvailableCamps(camps);

      setUserRole(role);
      setShowCampModal(true);
    } catch (err) {
      setError("Login failed: " + err.message);
    }
  };

  const handleCampSubmit = async () => {
    if (!campLocation.trim()) {
      setError("Please enter or select a camp location.");
      return;
    }

    const camp = campLocation.trim().toLowerCase();

    if (userRole === "nurse") {
      // ✅ Nurse can create new camp if not exists
      const campRef = doc(db, "camps_metadata", camp);
      await setDoc(campRef, { createdAt: new Date() }, { merge: true });
    }

    localStorage.setItem("selectedCamp", camp);

    switch (userRole) {
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
        setError("Invalid role.");
    }
  };

  return (
    <>
      {/* Tailwind CDN */}
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css"
        rel="stylesheet"
      />

      {/* Camp Selection Modal */}
      {showCampModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl text-center space-y-4">
            <h2 className="text-xl font-bold mb-4">Select or Create Camp Location</h2>

            {userRole === "nurse" ? (
              <>
                <select
                  value={campLocation}
                  onChange={(e) => setCampLocation(e.target.value)}
                  className="w-full p-3 border rounded-md mb-2"
                >
                  <option value="">-- Select existing camp --</option>
                  {availableCamps.map((camp) => (
                    <option key={camp} value={camp}>
                      {camp.charAt(0).toUpperCase() + camp.slice(1)}
                    </option>
                  ))}
                </select>

                <div className="text-gray-500 text-sm mb-2">or enter a new camp location</div>

                <input
                  type="text"
                  placeholder="Enter new location (e.g., Vashi)"
                  value={campLocation}
                  onChange={(e) => setCampLocation(e.target.value)}
                  className="w-full p-3 border rounded-md"
                />
              </>
            ) : (
              <select
                value={campLocation}
                onChange={(e) => setCampLocation(e.target.value)}
                className="w-full p-3 border rounded-md"
              >
                <option value=""> Select a location </option>
                {availableCamps.map((camp) => (
                  <option key={camp} value={camp}>
                    {camp.charAt(0).toUpperCase() + camp.slice(1)}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={handleCampSubmit}
              className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 mt-2"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Login Page */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Section */}
            <div className="hidden lg:block space-y-8 px-8">
              <div className="text-center lg:text-left">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 mb-8">
                  <img src={logo} alt="Brainline Logo" className="w-16 h-16" />
                  <div>
                    <h1 className="text-4xl font-bold text-gray-800">Brainline</h1>
                    <h2 className="text-xl text-gray-600">Purva Medical Trust</h2>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-blue-500">
                <h3 className="text-xl font-bold mb-4">Our Mission</h3>
                <p className="text-gray-700 mb-6">
                  Brainline is an initiative by Purva Medical Trust focused on raising awareness about brain stroke prevention. Our mission is rooted in the AAA principle — Awareness, Access, and Affordability — ensuring timely action and informed choices to avoid strokes altogether.
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">A</div>
                    <div className="text-sm">Awareness</div>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <div className="text-2xl font-bold text-indigo-600">A</div>
                    <div className="text-sm">Access</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">A</div>
                    <div className="text-sm">Affordability</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Login Form */}
            <div className="w-full max-w-md mx-auto lg:max-w-lg">
              <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold">Please Sign In</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Select Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-4 py-3 border-2 rounded-lg"
                    >
                      <option value="nurse">Nurse</option>
                      <option value="doctor">Doctor</option>
                      <option value="middleman">Middleman</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Email Address</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border-2 rounded-lg"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 border-2 rounded-lg"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleLogin}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700"
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

