import React,{useRef,useState}from"react";
import Webcam from"react-webcam";
import{ref,set}from"firebase/database";
import{rtdb}from"../../utils/firebaseConfig";
import{loadModels,getFaceDescriptorFromBlob}from"../../utils/faceUtils";

export default function FaceRegistration({uid,onComplete}){
  const webcamRef=useRef(null);
  const[captured,setCaptured]=useState(false);

  const captureFace=async()=>{
    const imageSrc=webcamRef.current.getScreenshot();
    const res=await fetch(imageSrc);
    const blob=await res.blob();
    await loadModels();
    const descriptor=await getFaceDescriptorFromBlob(blob);

    if(!descriptor){
      alert("Face not clear. Try again.");
      return;
    }

    await set(ref(rtdb,`faceData/${uid}`),Array.from(descriptor));
    alert("Face registered!");
    setCaptured(true);
    if(onComplete)onComplete();
  };

  return(
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Face Registration</h2>
      <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="rounded"/>
      <button onClick={captureFace} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
        Capture Face
      </button>
      {captured&&<p className="text-green-600 mt-2">✅ Face saved!</p>}
    </div>
  );
}
