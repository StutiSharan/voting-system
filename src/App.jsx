import React from "react";
import {BrowserRouter as Router,Routes,Route,Navigate} from "react-router-dom";
import Navbar from "./components/Common/Navbar";
import Footer from "./components/Common/Footer";
import Home from "./pages/Home";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Profile from "./pages/Profile";
import VotePage from "./components/Voting/VotePage";
import VoteReview from "./components/Voting/VoteReview";
import VoteSuccess from "./components/Voting/VoteSuccess";
import ElectionInfo from "./pages/ElectionInfo";
import AdminDashboard from "./pages/AdminDashboard";
import FaceVerify from "./components/Voting/FaceVerification";
import {Toaster} from "react-hot-toast";
import {useAuth} from "./context/AuthContext";

function AppRoutes(){
  const{user}=useAuth();

  return(
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path="/elections" element={user?<ElectionInfo/>:<Navigate to="/login"/>}/>
      <Route path="/review" element={<VoteReview/>}/>
      <Route path="/success" element={<VoteSuccess/>}/>
      <Route path="/admin" element={<AdminDashboard/>}/>
      <Route path="/face-verify" element={<FaceVerify/>}/>
      <Route path="/vote" element={<VotePage/>}/>
    </Routes>
  );
}

function App(){
  return(
    <Router>
      <Navbar/>
      <Toaster
        position="top-right"
        toastOptions={{
          duration:4000,
          style:{background:"#fff",color:"#333",borderRadius:"8px",padding:"12px"},
          success:{icon:"✅"},
          error:{icon:"❌"},
        }}
      />
      <AppRoutes/>
      <Footer/>
    </Router>
  );
}

export default App;
