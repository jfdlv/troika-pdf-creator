// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getAuth} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJp8YQwPaSXXsSaD7TkoEFoeoXAtdAsW8",
  authDomain: "troika-pdf-creator.firebaseapp.com",
  databaseURL: "https://troika-pdf-creator.firebaseio.com",
  projectId: "troika-pdf-creator",
  storageBucket: "troika-pdf-creator.appspot.com",
  messagingSenderId: "726707926519",
  appId: "1:726707926519:web:912a4baeb494d687636af2"
};

let firebaseApp = initializeApp(firebaseConfig);
let database = getFirestore(firebaseApp);
let auth = getAuth(firebaseApp);
// Initialize Firebase
export {database,auth};