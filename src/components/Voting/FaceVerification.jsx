import React,{useEffect,useRef,useState} from "react";
import * as faceapi from "face-api.js";
import {toast} from "react-hot-toast";

export default function FaceVerification({onVerified,onClose}){
  const videoRef=useRef();
  const[modelsLoaded,setModelsLoaded]=useState(false);
  const[verifying,setVerifying]=useState(false);

  useEffect(()=>{
    const loadModels=async()=>{
      const MODEL_URL="/models";
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      setModelsLoaded(true);
    };
    loadModels();
  },[]);

  useEffect(()=>{
    if(modelsLoaded)startCamera();
  },[modelsLoaded]);

  const startCamera=async()=>{
    try{
      const stream=await navigator.mediaDevices.getUserMedia({video:true});
      if(videoRef.current)videoRef.current.srcObject=stream;
    }catch(err){
      toast.error("❌ Camera access denied");
    }
  };

  const stopCamera=()=>{
    const stream=videoRef.current?.srcObject;
    if(stream){
      stream.getTracks().forEach(track=>track.stop());
      videoRef.current.srcObject=null;
    }
  };

  const handleClose=()=>{
    stopCamera();
    onClose();
  };

  const handleVerify=async()=>{
    setVerifying(true);

    const stored=localStorage.getItem("faceDescriptor");
    if(!stored){
      toast.error("❌ No registered face found in localStorage.");
      setVerifying(false);
      return;
    }

    let storedDescriptor;
    try{
      storedDescriptor=new Float32Array(JSON.parse(stored));
      console.log("Loaded descriptor from localStorage:",storedDescriptor);
    }catch(err){
      toast.error("❌ Failed to parse saved face descriptor.");
      setVerifying(false);
      return;
    }

    const result=await faceapi
      .detectSingleFace(videoRef.current,new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if(!result){
      toast.error("❌ No face detected. Try again.");
      setVerifying(false);
      return;
    }

    const liveDescriptor=result.descriptor;
    const distance=faceapi.euclideanDistance(liveDescriptor,storedDescriptor);
    console.log("🔍 Face distance:",distance);

    if(distance<0.45){
      toast.success("✅ Face matched! You may proceed.");
      stopCamera();
      onVerified();
    }else{
      toast.error("❌ Face does not match.");
    }

    setVerifying(false);
  };

  return(
    <div className="fixed inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md relative">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-2 py-1 hover:bg-red-600"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold text-center text-indigo-700 mb-4">🔒 Face Verification</h2>
        <video ref={videoRef} autoPlay muted width="320" height="240" className="mx-auto rounded shadow border-2 border-indigo-500"/>
        <div className="text-center mt-4">
          <button
            onClick={handleVerify}
            disabled={verifying}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded font-semibold disabled:opacity-50"
          >
            {verifying?"Verifying...":"Verify Face"}
          </button>
        </div>
      </div>
    </div>
  );
}
