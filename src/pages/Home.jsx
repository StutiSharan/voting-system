import React,{useState,useEffect} from "react";
import {Link} from "react-router-dom";
import {
  FaShieldAlt,FaFingerprint,FaMapMarkedAlt,
  FaVoteYea,FaUniversalAccess,FaSearchLocation,FaBell
} from "react-icons/fa";
import {motion} from "framer-motion";

export default function Home(){
  const[darkMode,setDarkMode]=useState(false);
  const[showAlert,setShowAlert]=useState(true); // Simulate new election notification

  // Auto-hide notification after 5 seconds
  useEffect(()=>{
    const timer=setTimeout(()=>setShowAlert(false),10000);
    return()=>clearTimeout(timer);
  },[]);

  const features=[
    {
      icon:<FaShieldAlt size={40} className="text-blue-600 dark:text-blue-400"/>,
      title:"Military-grade Security",
      desc:"End-to-end encryption ensures data protection."
    },
    {
      icon:<FaFingerprint size={40} className="text-purple-600 dark:text-purple-400"/>,
      title:"Facial Recognition",
      desc:"Biometric verification for authenticity."
    },
    {
      icon:<FaSearchLocation size={40} className="text-pink-600 dark:text-pink-400"/>,
      title:"Real-time Vote Tracking",
      desc:"Track your vote securely in real-time."
    },
    {
      icon:<FaMapMarkedAlt size={40} className="text-green-600 dark:text-green-400"/>,
      title:"Geo-Verification",
      desc:"Location-based fraud prevention with geofencing."
    },
    {
      icon:<FaVoteYea size={40} className="text-yellow-600 dark:text-yellow-400"/>,
      title:"Audit Trails",
      desc:"Every vote is logged for transparent validation."
    },
    {
      icon:<FaUniversalAccess size={40} className="text-indigo-600 dark:text-indigo-400"/>,
      title:"Inclusive Design",
      desc:"Built with accessibility for all users in mind."
    }
  ];

  return(
    <div className={`${darkMode?"dark":""}`}>
      <div className="font-sans bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white transition-colors duration-500 min-h-screen">

        {/* Navbar */}
<div className="bg-white dark:bg-gray-900 shadow-md px-6 py-3 flex justify-between items-center">
  <h1 className="text-xl font-bold text-blue-700 dark:text-white">🗳️ Online Voting</h1>
  <button
    onClick={()=>setDarkMode(!darkMode)}
    className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-1 rounded-full shadow-md hover:scale-105 transition"
  >
    {darkMode?"☀️ Light":"🌙 Dark"}
  </button>
</div>


        {/* Notification Bell */}
       {/* Notification below hero section */}
{showAlert&&(
  <motion.div
    initial={{y:-20,opacity:0}}
    animate={{y:0,opacity:1}}
    transition={{duration:2}}
    className="max-w-4xl mx-auto mt-6 bg-yellow-100 dark:bg-yellow-700 text-yellow-900 dark:text-white px-4 py-3 rounded-md shadow-md flex items-center gap-3 justify-center"
  >
    <FaBell className="animate-pulse"/>
    <p className="text-sm">
      📢 New election announced! <Link to="/elections" className="underline font-semibold">View details</Link>
    </p>
  </motion.div>
)}

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 text-white py-24 px-6 text-center dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-5xl mx-auto z-10 relative">
            <motion.h1
              initial={{opacity:0,y:-30}}
              animate={{opacity:1,y:0}}
              transition={{duration:0.8}}
              className="text-5xl md:text-6xl font-bold leading-tight drop-shadow-lg"
            >
              Secure Online Voting System
            </motion.h1>
            <motion.p
              initial={{opacity:0}}
              animate={{opacity:1}}
              transition={{delay:0.5}}
              className="mt-6 text-xl md:text-2xl text-indigo-100"
            >
              Empowering citizens with transparent, accessible and secure digital democracy.
            </motion.p>
            <motion.div
              initial={{scale:0.8,opacity:0}}
              animate={{scale:1,opacity:1}}
              transition={{delay:1}}
              className="mt-8 flex flex-wrap justify-center gap-4"
            >
              <Link to="/register" className="bg-white text-blue-700 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition">
                Register Now
              </Link>
              <Link to="/login" className="bg-blue-600 hover:bg-blue-800 text-white px-6 py-3 rounded-full font-semibold transition">
                Login
              </Link>
            </motion.div>
          </div>

          {/* Decorative Icons */}
          <div className="absolute inset-0 opacity-10 flex justify-around items-center pointer-events-none">
            <FaShieldAlt size={120}/>
            <FaFingerprint size={120}/>
            <FaMapMarkedAlt size={120}/>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 md:px-20">
          <motion.h2
            initial={{opacity:0,y:20}}
            whileInView={{opacity:1,y:0}}
            viewport={{once:true}}
            transition={{duration:0.6}}
            className="text-4xl font-bold text-center text-blue-800 dark:text-white mb-16"
          >
            Why Choose Us?
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-10">
            {features.map((feature,i)=>(
              <motion.div
                key={i}
                initial={{opacity:0,scale:0.9}}
                whileInView={{opacity:1,scale:1}}
                viewport={{once:true}}
                transition={{duration:0.4,delay:i*0.1}}
                className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-purple-700 to-indigo-800 dark:from-gray-800 dark:to-gray-900 text-white text-center py-20 px-4">
          <motion.h2
            initial={{opacity:0,y:10}}
            whileInView={{opacity:1,y:0}}
            transition={{duration:0.5}}
            className="text-4xl font-bold mb-4"
          >
            Your Vote. Your Power.
          </motion.h2>
          <motion.p
            initial={{opacity:0}}
            whileInView={{opacity:1}}
            transition={{delay:0.2}}
            className="text-lg mb-6 max-w-3xl mx-auto"
          >
            Don’t just watch change—be the change. Participate in secure digital voting today.
          </motion.p>
          <motion.div
            initial={{opacity:0,scale:0.95}}
            whileInView={{opacity:1,scale:1}}
            transition={{delay:0.4}}
          >
            <Link
              to="/elections"
              className="bg-white text-indigo-700 hover:text-white hover:bg-indigo-900 transition px-8 py-3 rounded-full font-semibold text-lg"
            >
              Cast Your Vote
            </Link>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
