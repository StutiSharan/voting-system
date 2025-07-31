import React from "react";
import{useNavigate}from"react-router-dom";

export default function VoteReview(){
  const navigate=useNavigate();
  const vote=localStorage.getItem("vote");

  const submitVote=()=>{
    // Save to database in real app
    localStorage.setItem("voteStatus","submitted");
    navigate("/success");
  };

  return(
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Review Your Vote</h2>
      <p className="mb-4">You selected: <strong>{vote}</strong></p>
      <div className="flex gap-4">
        <button onClick={()=>navigate("/elections")} className="bg-gray-400 text-white px-4 py-2 rounded">Back</button>
        <button onClick={submitVote} className="bg-green-600 text-white px-4 py-2 rounded">Submit Vote</button>
      </div>
    </div>
  )
}
