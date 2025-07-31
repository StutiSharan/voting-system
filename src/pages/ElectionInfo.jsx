import React,{useEffect,useState} from "react";
import {useAuth} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";
import {getDatabase,ref,onValue,get,runTransaction} from "firebase/database";
import {motion,AnimatePresence} from "framer-motion";
import {toast} from "react-hot-toast";
import ConfettiExplosion from "react-confetti-explosion";



export default function ElectionInfo(){
  const{user}=useAuth();
  const navigate=useNavigate();
  const db=getDatabase();
  const[selectedState,setSelectedState]=useState("");
  const[selectedCity,setSelectedCity]=useState("");
  const[votes,setVotes]=useState({});
  const[userVotes,setUserVotes]=useState({});
  const[userCity,setUserCity]=useState("");
  const[showFAQs,setShowFAQs]=useState(false);
  const[showCelebration,setShowCelebration]=useState(false);
  const[selectedCandidate,setSelectedCandidate]=useState("");
  const[showReviewModal,setShowReviewModal]=useState(false);
  const[showLeaderboard,setShowLeaderboard]=useState(false);
  const statesWithCities={
  "Uttar Pradesh":["Kanpur","Lucknow","Varanasi","Agra","Noida"],
  "Maharashtra":["Mumbai","Pune","Nagpur","Nashik","Aurangabad"],
  "Karnataka":["Bengaluru","Mysore","Mangalore","Hubli","Belgaum"],
  "West Bengal":["Kolkata","Howrah","Asansol","Durgapur","Siliguri"],
  "Delhi":["New Delhi","Dwarka","Rohini","Karol Bagh","Saket"],
  "Tamil Nadu":["Chennai","Coimbatore","Madurai","Salem","Tiruchirapalli"],
  "Rajasthan":["Jaipur","Udaipur","Jodhpur","Ajmer","Bikaner"],
  "Gujarat":["Ahmedabad","Surat","Rajkot","Vadodara","Gandhinagar"],
  "Bihar":["Patna","Gaya","Muzaffarpur","Bhagalpur","Darbhanga"],
  "Punjab":["Amritsar","Ludhiana","Jalandhar","Patiala","Bathinda"]
};

const electionsData={
  Kanpur:{id:"kanpur-2025",name:"Kanpur Municipal Election - July 30, 2025",candidates:["Alok Verma","Neha Tiwari","Sanjay Tripathi","Nisha Yadav","Amit Saxena"]},
  Lucknow:{id:"lucknow-2025",name:"Lucknow Local Body Election - Aug 12, 2025",candidates:["Pooja Singh","Ravi Kumar","Anil Tyagi","Kiran Rawat"]},
  Varanasi:{id:"varanasi-2025",name:"Varanasi Mayoral Election - Sept 1, 2025",candidates:["Meena Chauhan","Shyam Mishra","Rajeev Gupta"]},
  Mumbai:{id:"mumbai-2025",name:"Mumbai Assembly Election - Aug 5, 2025",candidates:["Sneha Joshi","Ravi Iyer","Manish Desai","Fatima Sheikh"]},
  Pune:{id:"pune-2025",name:"Pune Local Body Election - Sept 10, 2025",candidates:["Sameer Kulkarni","Pallavi Joshi","Ninad Patil"]},
  Nagpur:{id:"nagpur-2025",name:"Nagpur Municipal Election - Oct 3, 2025",candidates:["Akash More","Komal Pawar","Devendra Kale"]},
  Bengaluru:{id:"bengaluru-2025",name:"Bengaluru Mayoral Election - Aug 10, 2025",candidates:["Meera Pai","Rahul Nair","Snehal Reddy","Vinay Rao"]},
  Mysore:{id:"mysore-2025",name:"Mysore Ward Election - Sept 8, 2025",candidates:["Deepa Hegde","Arun S"]},
  Kolkata:{id:"kolkata-2025",name:"Kolkata Ward Election - Aug 15, 2025",candidates:["Suman Ghosh","Anjali Roy","Tanmay Banerjee"]},
  Howrah:{id:"howrah-2025",name:"Howrah Assembly Election - Sept 22, 2025",candidates:["Bishal Dey","Meenakshi Ghosh","Arup Ghoshal"]},
  "New Delhi":{id:"delhi-2025",name:"Delhi State Election - July 20, 2025",candidates:["Arjun Mehra","Divya Singh","Karan Das","Ritu Malik"]},
  Dwarka:{id:"dwarka-2025",name:"Dwarka Ward Election - Sept 30, 2025",candidates:["Rakesh Kumar","Sunita Mehra"]},
  Chennai:{id:"chennai-2025",name:"Chennai Local Body Election - Aug 18, 2025",candidates:["Lakshmi Iyer","Sundar Raman","Geetha R"]},
  Coimbatore:{id:"coimbatore-2025",name:"Coimbatore Mayoral Election - Oct 12, 2025",candidates:["Karthik C","Divya B","Saravanan R"]},
  Jaipur:{id:"jaipur-2025",name:"Jaipur Ward Election - Aug 25, 2025",candidates:["Pushpa Yadav","Gopal Saini","Farida Begum"]},
  Udaipur:{id:"udaipur-2025",name:"Udaipur Local Body Election - Sept 5, 2025",candidates:["Shreya Rathore","Manoj Tiwari"]},
  Ahmedabad:{id:"ahmedabad-2025",name:"Ahmedabad Assembly Election - Aug 28, 2025",candidates:["Ravi Shah","Priti Patel","Nirav Joshi"]},
  Surat:{id:"surat-2025",name:"Surat Local Body Election - Oct 6, 2025",candidates:["Zeba Khan","Haresh Vyas"]},
  Patna:{id:"patna-2025",name:"Patna Municipal Election - Aug 14, 2025",candidates:["Suresh Prasad","Pinky Devi","Rohit Jha"]},
  Gaya:{id:"gaya-2025",name:"Gaya Mayoral Election - Sept 18, 2025",candidates:["Anita Kumari","Ashok Yadav"]},
  Amritsar:{id:"amritsar-2025",name:"Amritsar Ward Election - Aug 11, 2025",candidates:["Baljit Singh","Harpreet Kaur","Gurmeet Gill"]},
  Ludhiana:{id:"ludhiana-2025",name:"Ludhiana Local Body Election - Oct 15, 2025",candidates:["Satish Malhotra","Navjot Kaur"]},
};

const faqs=[
  {question:"How do I vote?",answer:"Select your state and city, then click the 'Vote' button next to your candidate."},
  {question:"Can I change my vote?",answer:"No, once cast, your vote cannot be changed."},
  {question:"Is voting anonymous?",answer:"Yes, all votes are securely stored and private."},
  {question:"How is voting secured?",answer:"We use Firebase auth and transactions to ensure vote integrity."}
];

  useEffect(()=>{
    if(!user)return navigate("/register");

    const profileRef = ref(db, `users/${user.uid}/profile`);
get(profileRef).then(snapshot => {
  if(snapshot.exists()){
    const data = snapshot.val();
    setUserCity(data.city || "");
  }
});


    Object.entries(electionsData).forEach(([city,{id,candidates}])=>{
      const votesRef=ref(db,`votes/${id}`);
      onValue(votesRef,snapshot=>{
        const data=snapshot.val()||{};
        setVotes(prev=>({...prev,[id]:data}));
      });

      // Initialize random votes once (only if they don’t exist)
      get(votesRef).then(snap=>{
        if(!snap.exists()){
          const initialVotes={};
          candidates.forEach(name=>{
            initialVotes[name]=Math.floor(Math.random()*5); // random 0-4 votes
          });
          set(votesRef,initialVotes);
        }
      });
    });

    const fetchUserVotes=async()=>{
      const userVotesRef=ref(db,`userVotes/${user.uid}`);
      const snapshot=await get(userVotesRef);
      setUserVotes(snapshot.exists()?snapshot.val():{});
    };
    fetchUserVotes();
  },[user,navigate]);

  const handleVote=async()=>{
    if(!user)return navigate("/login");
    if(userCity!==selectedCity){
      toast.error("🚫 You can only vote in your registered city.");
      return;
    }

    const electionId=election.id;
    const candidate=selectedCandidate;

    const userVoteCheckRef=ref(db,`userVotes/${user.uid}/${electionId}`);
    const userVoteSnapshot=await get(userVoteCheckRef);
    if(userVoteSnapshot.exists()){
      toast.error("🛑 You have already voted in this election.");
      return;
    }

    const candidateRef=ref(db,`votes/${electionId}/${candidate}`);
    const userVoteRef=ref(db,`userVotes/${user.uid}/${electionId}`);

    try{
      await runTransaction(candidateRef,current=>(current||0)+1);
      await runTransaction(userVoteRef,()=>true);
      setUserVotes(prev=>({...prev,[electionId]:true}));
      setShowCelebration(true);
      toast.success(`🎉 Voted for ${candidate} successfully!`);
      setTimeout(()=>setShowCelebration(false),5000);
      setShowLeaderboard(true);
    }catch(err){
      toast.error("❌ Vote failed. Try again.");
    }finally{
      setShowReviewModal(false);
      setSelectedCandidate("");
    }
  };

  const cities=selectedState?statesWithCities[selectedState]:[];
  const election=electionsData[selectedCity];
  const electionVotes=election?votes[election.id]||{}:{};
  const totalVotes=Object.values(electionVotes).reduce((a,b)=>a+b,0);
  const maxVotes=Math.max(...Object.values(electionVotes),0);

  const sortedCandidates=Object.entries(electionVotes)
    .sort((a,b)=>b[1]-a[1])
    .map(([name,vote])=>({name,vote}));

  return(
    <div className="pt-28 pb-16 px-6 min-h-screen bg-gradient-to-br from-purple-200 via-blue-100 to-pink-200 relative">
     {showCelebration&&(
  <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
    <ConfettiExplosion force={0.7} duration={3000} particleCount={250} width={1000}/>
  </div>
)}


      <motion.h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-10 drop-shadow-md" initial={{y:-20,opacity:0}} animate={{y:0,opacity:1}}>
        🗳️ Vote in Your City!
      </motion.h2>

      {/* State Selector */}
      <div className="max-w-xl mx-auto text-center mb-6">
        <label className="block font-semibold text-gray-800 mb-1">Select State:</label>
        <select value={selectedState} onChange={e=>{setSelectedState(e.target.value);setSelectedCity("");}} className="w-full p-3 border border-gray-300 rounded-lg">
          <option value="">-- Choose a State --</option>
          {Object.keys(statesWithCities).map(state=><option key={state} value={state}>{state}</option>)}
        </select>
      </div>

      {/* City Selector */}
      {cities.length>0&&(
        <div className="max-w-xl mx-auto text-center mb-8">
          <label className="block font-semibold text-gray-800 mb-1">Select City:</label>
          <select value={selectedCity} onChange={e=>setSelectedCity(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg">
            <option value="">-- Choose a City --</option>
            {cities.map(city=><option key={city} value={city}>{city}</option>)}
          </select>
        </div>
      )}

      {/* Election Display */}
      {election&&(
        <motion.section className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-2xl border-l-8 border-indigo-500" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
          <h3 className="text-2xl font-bold text-indigo-800 mb-6">{election.name}</h3>
          <ul className="space-y-6">
            {election.candidates.map(candidate=>{
              const candidateVotes=electionVotes[candidate]||0;
              const ratio=totalVotes?((candidateVotes/totalVotes)*100).toFixed(1):0;
              const isWinner=candidateVotes===maxVotes&&maxVotes>0;
              const userVoted=userVotes[election.id];

              return(
                <li key={candidate} className={`flex flex-col sm:flex-row justify-between items-center p-4 rounded-xl border shadow-sm bg-gradient-to-r ${isWinner?"from-yellow-100 to-yellow-50 border-yellow-400":"from-white to-gray-100"}`}>
                  <div className="text-lg font-medium text-gray-700">
                    {candidate} {isWinner&&<span className="text-yellow-600 font-bold ml-2">🏆 Leading</span>}
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto mt-4 sm:mt-0">
                    <div className="flex-1 sm:w-48 bg-gray-300 rounded h-4 overflow-hidden">
                      <motion.div className="bg-indigo-600 h-4 rounded" initial={{width:0}} animate={{width:`${ratio}%`}} transition={{duration:1.2}} />
                    </div>
                   {userVotes[election.id] ? (
  <span className="text-sm font-semibold text-gray-800 w-20 text-right">
    {candidateVotes} ({ratio}%)
  </span>
) : (
  <span className="text-sm font-medium text-gray-500 w-20 text-right">
    Hidden
  </span>
)}

                    <button
                      disabled={!!userVoted}
                      onClick={()=>{
                        setSelectedCandidate(candidate);
                        setShowReviewModal(true);
                      }}
                      className={`ml-2 px-4 py-2 text-sm rounded-lg font-semibold transition ${userVoted?"bg-gray-400 cursor-not-allowed text-white":"bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"}`}
                    >
                      Vote
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </motion.section>
      )}

      {/* Leaderboard */}
      {showLeaderboard&&sortedCandidates.length>0&&(
        <motion.div className="max-w-3xl mx-auto mt-12 bg-white p-6 rounded-xl shadow-xl border border-indigo-200" initial={{opacity:0}} animate={{opacity:1}}>
          <h3 className="text-xl font-bold text-indigo-700 mb-4 text-center">🏁 Live Leaderboard</h3>
          <ul className="space-y-3">
            {sortedCandidates.map((cand,i)=>(
              <li key={cand.name} className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-lg shadow-sm">
                <span className="font-semibold text-gray-800">{i+1}. {cand.name}</span>
                <span className="text-indigo-700 font-bold">{cand.vote} votes</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* FAQs */}
      <div className="max-w-4xl mx-auto mt-14">
        <button onClick={()=>setShowFAQs(prev=>!prev)} className="w-full text-center bg-indigo-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-indigo-700 transition">
          {showFAQs?"Hide Guidelines & FAQs":"View Election Guidelines & FAQs"}
        </button>
        <AnimatePresence>
          {showFAQs&&(
            <motion.div className="mt-6 bg-white p-6 rounded-xl shadow-xl border border-indigo-100" initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}} transition={{duration:0.4}}>
              <h4 className="text-xl font-bold text-indigo-700 mb-4">📋 Guidelines & FAQs</h4>
              <ul className="space-y-4 text-gray-700 text-sm">
                {faqs.map((faq,i)=>(
                  <li key={i}>
                    <strong>Q: {faq.question}</strong>
                    <p className="ml-2 mt-1">A: {faq.answer}</p>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal&&(
          <motion.div initial={{opacity:0,y:-50}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-50}} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <motion.div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md">
              <h3 className="text-xl font-bold text-indigo-700 mb-4">Review Your Vote</h3>
              <p className="mb-4">You are about to vote for <strong>{selectedCandidate}</strong> in the <strong>{selectedCity}</strong> election.</p>
              <div className="flex justify-end gap-4">
                <button onClick={()=>setShowReviewModal(false)} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg font-semibold">
                  Cancel
                </button>
                <button onClick={handleVote} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold">
                  Confirm Vote
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}