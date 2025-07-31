import React,{useState,useEffect} from "react";
import {Link,useLocation,useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext";
import {Menu,X,LogOut,User} from "lucide-react";
import {motion,AnimatePresence} from "framer-motion";

export default function Navbar(){
  const{user,logout}=useAuth();
  const[isOpen,setIsOpen]=useState(false);
  const[showDropdown,setShowDropdown]=useState(false);
  const location=useLocation();
  const navigate=useNavigate();

  useEffect(()=>{
    setIsOpen(false);
  },[location.pathname]);

  const toggleMenu=()=>setIsOpen(prev=>!prev);
  const toggleDropdown=()=>setShowDropdown(prev=>!prev);
  const handleLogout=async()=>{
    await logout();
    navigate("/login");
  };

  const linkClasses=(path)=>
    `block py-2 px-4 rounded transition font-semibold ${
      location.pathname===path
        ? "bg-yellow-400 text-indigo-900"
        : "hover:bg-yellow-300 hover:text-indigo-900"
    }`;

  const getInitial=(email)=>{
    return email?.charAt(0).toUpperCase()||"?";
  };

  const getName=(email)=>{
    return email?.split("@")[0];
  };

  return(
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-indigo-700 shadow-lg"
      initial={{y:-100}}
      animate={{y:0}}
      transition={{type:"spring",stiffness:120}}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-10 flex items-center justify-between h-16">
        <Link to="/" className="text-3xl font-extrabold uppercase tracking-wide text-white">
          VotingApp
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex lg:items-center lg:gap-6 text-white">
          <Link to="/" className={linkClasses("/")}>Home</Link>
          <Link to="/elections" className={linkClasses("/elections")}>Elections</Link>

          {user?(
            <div className="relative">
              <button onClick={toggleDropdown} className="flex items-center gap-2 bg-yellow-300 text-indigo-900 px-3 py-1 rounded-full font-bold">
                <span className="w-8 h-8 rounded-full bg-indigo-800 text-white flex items-center justify-center">
                  {getInitial(user.email)}
                </span>
                <span className="capitalize">{getName(user.email)}</span>
              </button>
              {showDropdown&&(
                <div className="absolute right-0 mt-2 bg-white text-indigo-800 shadow-lg rounded-md w-40 z-10">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                    <User size={16}/> Profile
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600">
                    <LogOut size={16}/> Logout
                  </button>
                </div>
              )}
            </div>
          ):(
            <Link to="/login" className={linkClasses("/login")}>Login</Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded text-white hover:bg-yellow-300 hover:text-indigo-900"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen?<X size={28}/>:<Menu size={28}/>}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen&&(
          <motion.div
            className="lg:hidden bg-white shadow-lg rounded-b-lg max-w-xs mx-auto mt-0.5"
            initial={{opacity:0,height:0}}
            animate={{opacity:1,height:"auto"}}
            exit={{opacity:0,height:0}}
            transition={{duration:0.25}}
          >
            <nav className="flex flex-col px-4 py-3 gap-2">
              <Link to="/" className={linkClasses("/")} onClick={()=>setIsOpen(false)}>Home</Link>
              <Link to="/elections" className={linkClasses("/elections")} onClick={()=>setIsOpen(false)}>Elections</Link>
              {user?(
                <>
                  <Link to="/profile" className={linkClasses("/profile")} onClick={()=>setIsOpen(false)}>Profile</Link>
                  <button onClick={handleLogout} className="text-left px-4 py-2 text-red-600 hover:bg-gray-200">Logout</button>
                </>
              ):(
                <Link to="/login" className={linkClasses("/login")} onClick={()=>setIsOpen(false)}>Login</Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
