//creating axios instance so that we can call it multiple times
import axios from 'axios';



const axiosInstance =  axios.create({
    
    baseURL: 'https://legalkart.wrctpl.com/', 
    headers: {
        'Content-Type': 'application/json'
    }
})




  export default axiosInstance;