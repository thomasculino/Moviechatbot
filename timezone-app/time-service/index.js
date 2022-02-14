const axios = require('axios');


const apikey='Lu8m32cdH8CFrD5bMuCgNtpTn7QdC6';//should be in env file but i put it here for test.

const getTime = location => {
  return new Promise(async (resolve, reject) => {
    try {
      const timezone = await axios.get(
         `https://www.amdoren.com/api/timezone.php?api_key=${apikey}&loc=${location}` 
        );
      resolve(timezone.data.time)
    }
    catch (error) {
      reject(error);
    }
  });
}

const echotest = txt => {
  return new Promise(async (resolve, reject) => {
     //simulating a time consuming task
     setTimeout(()=>{
        if (txt=='error')
          reject(`test error message`) 
        else 
          resolve(txt) 
     }, 1000);
  });
}
module.exports={getTime,echotest}