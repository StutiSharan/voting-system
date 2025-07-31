import React,{useState,useEffect} from"react";
import{useNavigate} from"react-router-dom";

export default function VotePage(){
  const navigate=useNavigate();
  const[candidate,setCandidate]=useState("");
  const[hasVoted,setHasVoted]=useState(false);
  const[votes,setVotes]=useState({});
  const[isCelebrating,setIsCelebrating]=useState(false);

  const candidateList=["Candidate A","Candidate B","Candidate C"];

  useEffect(()=>{
    // Initialize with random votes
    const initialVotes={};
    candidateList.forEach(name=>{
      initialVotes[name]=Math.floor(Math.random()*50)+1;
    });
    setVotes(initialVotes);
  },[]);

  const handleVote=()=>{
    if(candidate==="")return alert("Select a candidate.");
    const updatedVotes={...votes,[candidate]:votes[candidate]+1};
    setVotes(updatedVotes);
    localStorage.setItem("vote",candidate);
    setHasVoted(true);
    setIsCelebrating(true);
    setTimeout(()=>setIsCelebrating(false),3000);
  };

  const getTotalVotes=()=>Object.values(votes).reduce((a,b)=>a+b,0);

  const getPercentage=(name)=>{
    const total=getTotalVotes();
    return total===0?0:(votes[name]/total)*100;
  };

  const sortedCandidates=Object.entries(votes).sort((a,b)=>b[1]-a[1]);

  return(
    <div className="relative p-6 max-w-xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-6">🗳️ Cast Your Vote</h2>

      {!hasVoted&&candidateList.map((name,i)=>(
        <div key={i} className="mb-3 text-left">
          <input type="radio" id={name} name="vote" value={name} onChange={()=>setCandidate(name)}/>
          <label htmlFor={name} className="ml-2 text-lg">{name}</label>
        </div>
      ))}

      {!hasVoted&&(
        <button onClick={handleVote} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Submit Vote
        </button>
      )}

      {/* Celebration Popup */}
      {isCelebrating&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative p-8 bg-white rounded-2xl shadow-xl text-center max-w-sm w-full animate-bounce">
            <h2 className="text-2xl font-bold text-green-600 mb-2">🎉 Vote Cast Successfully!</h2>
            <p className="text-gray-700">Thank you for participating in democracy!</p>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[...Array(8)].map((_,i)=>(
                <div key={i} className="absolute bottom-0 animate-float" style={{
                  left:`${12.5*i}%`,
                  animationDuration:`${2+Math.random()*2}s`,
                  animationDelay:`${Math.random()}s`
                }}>🎈</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      {!isCelebrating&&hasVoted&&(
        <div className="mt-10">
          <h3 className="text-2xl font-semibold mb-4">📊 Leaderboard</h3>
          {sortedCandidates.map(([name,count])=>(
            <div key={name} className="mb-4 text-left">
              <span className="font-medium">{name}</span>
              <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
                <div className="bg-green-500 h-4 rounded-full" style={{width:`${getPercentage(name)}%`}}/>
              </div>
              <p className="text-sm text-gray-600">{getPercentage(name).toFixed(1)}%</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
