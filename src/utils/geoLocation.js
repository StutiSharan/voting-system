export const getCurrentLocation=()=>{
  return new Promise((resolve,reject)=>{
    if(!navigator.geolocation){
      reject("Geolocation not supported.");
    }else{
      navigator.geolocation.getCurrentPosition(
        pos=>resolve({lat:pos.coords.latitude,lng:pos.coords.longitude}),
        err=>reject(err.message)
      );
    }
  });
};
