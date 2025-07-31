import React,{useContext,useState,useEffect,createContext} from "react";
import {getAuth,onAuthStateChanged,signOut} from "firebase/auth";
import {auth} from "../utils/firebaseConfig"; // Make sure this points to your firebase initialization

const AuthContext=createContext();

export function useAuth(){
  return useContext(AuthContext);
}

export function AuthProvider({children}){
  const[user,setUser]=useState(null);
  const[loading,setLoading]=useState(true);

  useEffect(()=>{
    const unsubscribe=onAuthStateChanged(auth,currentUser=>{
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  },[]);

  const logout=()=>signOut(auth);

  const value={user,logout};

  return(
    <AuthContext.Provider value={value}>
      {!loading&&children}
    </AuthContext.Provider>
  );
}
