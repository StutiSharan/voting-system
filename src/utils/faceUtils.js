import * as faceapi from 'face-api.js';

export async function loadModels(){
  const MODEL_URL='/models';
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
  await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
}

export async function getFaceDescriptorFromBlob(blob){
  const img=await faceapi.bufferToImage(blob);
  const detection=await faceapi
    .detectSingleFace(img,new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor();
  return detection?.descriptor;
}
