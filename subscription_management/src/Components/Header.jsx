import styles from "./Header.module.css";
import React, { useState,useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { StyledFirebaseAuth } from "react-firebaseui";
import axios from "axios";
import { auth } from "firebaseui";

// Just checking if the connection is being made between UI and BE
// axios
//   .get("http://localhost:1010/")
//   .then((data) => console.log(data))
//   .catch(()=>console.log("not connected properly"));
const backend = 'http://localhost:1010/'
const firebaseConfig = {
  //apiKey removed for security reasons
  authDomain: "subscription-management-c5569.firebaseapp.com",
  projectId: "subscription-management-c5569",
  storageBucket: "subscription-management-c5569.firebasestorage.app",
  messagingSenderId: "526313794704",
  appId: "1:526313794704:web:d8e082d15bd5d4d21efc15",
  measurementId: "G-Q90D1XMFW0",
};
// preventing the configuration again if already configured
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);


    //this is responsible for showing the firebase ui as the popup and there is an alternative for popup that is redirect
    const uiConfig = {
        signInFlow: "popup",
        //what ever we provide are shown 
        signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
        signInSuccessWithAuthResult: (authresult) => {
            setIsAuthModalOpen(false);
            // console.log(authresult.user.getIdToken().then((token)=>console.log(token)));
            const idToken = getToken(authresult);
            idToken
              .then((token) => {
                const setToken = token;
                // axios.post(backend+'user',{setToken}).then().catch();
                axios.post(backend+"user",{},{
                    headers:{
                        "Authorization":`Bearer ${token}`
                    },
                    withCredentials:true
                });
              })
              .catch("not set ")
              .error(error);
            console.log(setToken);
            return false; // Don't redirect
        },
        },
    };
    const getToken = async (authresult)=>{
        try{
            const token = await authresult.user.getIdToken();
            return token;
        }catch(error)
        {
            return error;
        }
    };
    useEffect(() => {
        const unregisterAuthObserver = firebase
        .auth()
        .onAuthStateChanged((user) => {
            user?console.log(user.getIdToken()):"";
            setUser(user);
        });

        // Cleanup subscription on unmount
        return () => unregisterAuthObserver();
    }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleAuthModal = () => {
    setIsAuthModalOpen(!isAuthModalOpen);
  };

  const handleLogout = () => {
    
    firebase.auth().signOut();
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-pink-50 to-purple-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo Section (Left) */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {/* Replace with your company logo */}
                <img className="h-8 w-auto" src="/company-logo.jpeg" alt="Company Logo" />
              </div>
            </div>
            
            {/* Desktop Navigation (Right) */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Manage Subscription
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                About Us
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Contact Us
              </a>
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700 text-sm font-medium">
                    {user.displayName || user.email}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={toggleAuthModal}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-700 hover:to-purple-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Login/Signup
                </button>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="flex md:hidden items-center">
              <button 
                type="button" 
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500" 
                aria-controls="mobile-menu" 
                aria-expanded={isMenuOpen}
                onClick={toggleMenu}
              >
                <span className="sr-only">Open main menu</span>
                {/* Menu icon */}
                {!isMenuOpen ? (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#" className="block text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium">
              Manage Subscription
            </a>
            <a href="#" className="block text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium">
              About Us
            </a>
            <a href="#" className="block text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium">
              Contact Us
            </a>
            {user ? (
              <>
                <div className="block px-3 py-2 text-gray-700 font-medium">
                  {user.displayName || user.email}
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left block text-white bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-md text-base font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <button 
                onClick={toggleAuthModal}
                className="w-full text-left block text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 px-3 py-2 rounded-md text-base font-medium"
              >
                Login/Signup
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
              onClick={toggleAuthModal}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="sr-only">Close</span>
            </button>
            
            <h2 className="text-xl font-bold text-center mb-6 text-gray-900">Sign in to your account</h2>
            
            <StyledFirebaseAuth 
              uiConfig={uiConfig} 
              firebaseAuth={firebase.auth()} 
            />
          </div>
        </div>
      )}
    </>
  );
}
