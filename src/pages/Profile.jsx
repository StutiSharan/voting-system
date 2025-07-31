import React,{useEffect,useRef,useState} from "react";
import {Toaster,toast} from "react-hot-toast";
import * as faceapi from "face-api.js";
import {ref,get,set,remove} from "firebase/database";
import {rtdb} from "../utils/firebaseConfig";
import {useAuth} from "../context/AuthContext";

export default function Profile(){
  const[name,setName]=useState("");
  const[bio,setBio]=useState("");
  const[age,setAge]=useState("");
 const [city,setCity]=useState("");

  const[voterId,setVoterId]=useState("");
  const[image,setImage]=useState(null);
  const[dark,setDark]=useState(localStorage.getItem("darkMode")==="true");
  const[showForm,setShowForm]=useState(false);
  const[showConfirm,setShowConfirm]=useState(false);
  const fileInputRef=useRef(null);
  const toastIdRef=useRef(null);
  const{user}=useAuth();

  // Load user-specific profile
  useEffect(()=>{
    if(!user)return;
    const userRef=ref(rtdb,`users/${user.uid}/profile`);
    get(userRef).then(snapshot=>{
      if(snapshot.exists()){
        const data=snapshot.val();
        setName(data.name||"");
        setBio(data.bio||"");
        setAge(data.age||"");
        setCity(data.city||"");

        setVoterId(data.voterId||"");
        setImage(data.image||null);
      }
    });
    document.body.className=dark?"dark":"";
    localStorage.setItem("darkMode",dark);
  },[user,dark]);

  const showToast=(msg,type)=>{
    if(toastIdRef.current)toast.dismiss(toastIdRef.current);
    toastIdRef.current=toast[type](msg,{
      duration:3000,
      style:{padding:"10px 20px",background:type==="success"?"#4ade80":type==="error"?"#f87171":"#facc15",color:"#000"}
    });
  };

  const handleSave=()=>{
   if(!name||!bio||!age||!city||!voterId)
{
      showToast("All fields are required!","error");
      return;
    }
    const userRef=ref(rtdb,`users/${user.uid}/profile`);
    set(userRef,{name,bio,age,city,voterId,image})

      .then(()=>{
        showToast("✅ Profile saved successfully","success");
        setShowForm(false);
      })
      .catch(()=>showToast("❌ Failed to save","error"));
  };

  const handleImageChange=(e)=>{
    const file=e.target.files[0];
    if(file){
      const reader=new FileReader();
      reader.onload=()=>{
        const dataUrl=reader.result;
        setImage(dataUrl);
        showToast("🖼️ Image loaded","default");

        const img=new Image();
        img.src=dataUrl;
        img.onload=async()=>{
          try{
            const MODEL_URL="/models";
            await Promise.all([
              faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
              faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
              faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
            ]);
            const detection=await faceapi
              .detectSingleFace(img,new faceapi.TinyFaceDetectorOptions())
              .withFaceLandmarks()
              .withFaceDescriptor();
            if(detection){
              const descriptor=Array.from(detection.descriptor);
              localStorage.setItem("faceDescriptor",JSON.stringify(descriptor));
              showToast("✅ Face descriptor saved","success");
            }else{
              showToast("❌ No face detected in image","error");
            }
          }catch(err){
            console.error(err);
            showToast("❌ Face detection failed","error");
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmDelete=()=>{
    const userRef=ref(rtdb,`users/${user.uid}/profile`);
    remove(userRef).then(()=>{
      setName("");setBio("");setAge("");setAddress("");setVoterId("");setImage(null);
      setShowForm(false);setShowConfirm(false);
      showToast("🗑️ Profile deleted","error");
    });
  };

  const toggleTheme=()=>setDark(!dark);

  return(
    <div className={`${dark?"bg-gray-900 text-white":"bg-gradient-to-br from-purple-200 via-pink-100 to-yellow-100"} pt-20 px-4 min-h-screen animate-fadeIn`}>
      <Toaster position="top-right"/>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-extrabold text-center text-purple-700 w-full">Your Voter Profile</h2>
        <button onClick={toggleTheme} className="absolute top-6 right-6 bg-indigo-500 text-white px-3 py-1 rounded-full text-sm hover:bg-indigo-600">{dark?"Light Mode":"Dark Mode"}</button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 justify-center items-start">
        <div className="w-full md:w-[400px] flex justify-center">
          <div className="border-4 border-purple-300 p-6 rounded-xl shadow-xl bg-white dark:bg-gray-800 w-full animate-slideIn">
            <h3 className="text-2xl font-semibold mb-3 text-center text-purple-600 dark:text-purple-300">Voter ID Card</h3>
            {image&&<img src={image} alt="Profile" className="w-32 h-32 object-cover rounded-full mx-auto mb-4 border-4 border-yellow-400"/>}
            <p className="text-gray-700 dark:text-gray-200"><strong>Name:</strong> {name}</p>
            <p className="text-gray-700 dark:text-gray-200"><strong>Bio:</strong> {bio}</p>
            <p className="text-gray-700 dark:text-gray-200"><strong>Age:</strong> {age}</p>
           <p className="text-gray-700 dark:text-gray-200"><strong>City:</strong> {city}</p>
 <p className="text-gray-700 dark:text-gray-200"><strong>Voter ID:</strong> {voterId}</p>
            <div className="flex justify-center mt-4">
              <button onClick={()=>setShowForm(!showForm)} className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition">{showForm?"Close Edit Form":"Edit Profile"}</button>
            </div>
          </div>
        </div>

        {showForm&&(
          <div className="w-full md:w-[300px] space-y-3 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg animate-fadeIn">
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="border p-2 w-full rounded-lg dark:bg-gray-700"/>
            <textarea value={bio} onChange={e=>setBio(e.target.value)} placeholder="Bio" className="border p-2 w-full rounded-lg dark:bg-gray-700"/>
            <input value={age} onChange={e=>setAge(e.target.value)} placeholder="Age" className="border p-2 w-full rounded-lg dark:bg-gray-700"/>
           <input value={city} onChange={e=>setCity(e.target.value)} placeholder="City" className="border p-2 w-full rounded-lg dark:bg-gray-700"/>
            <input value={voterId} onChange={e=>setVoterId(e.target.value)} placeholder="Voter ID" className="border p-2 w-full rounded-lg dark:bg-gray-700"/>
            <label className="block text-sm text-gray-600 dark:text-gray-300">Choose Profile Image:</label>
            <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="file:py-1 file:px-3 file:rounded-full file:bg-violet-50 hover:file:bg-violet-100"/>
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600">Save</button>
              <button onClick={()=>setShowConfirm(true)} className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600">Delete</button>
            </div>
          </div>
        )}
      </div>

      {showConfirm&&(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-2xl w-[90%] md:w-[300px] text-center">
            <p className="mb-4 text-lg font-semibold">Are you sure you want to delete your profile?</p>
            <div className="flex justify-center gap-4">
              <button onClick={confirmDelete} className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600">Yes</button>
              <button onClick={()=>setShowConfirm(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-400">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
