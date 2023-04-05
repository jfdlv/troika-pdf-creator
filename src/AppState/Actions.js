import axios from "axios";
import isEmpty from "lodash/isEmpty";
import { doc, collection, getDocs, getDoc } from "firebase/firestore"; 
import {database,auth} from "../config/firebase";
import {signInWithEmailAndPassword} from 'firebase/auth';

export const useActions = (state, dispatch) => {

  const logIn = (
    credentials,
    // { setShowSpinner, setShowErrorMessage, setErrorMessage },
    {setOpenLogin}
  ) => {
    signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password,
    )
      .then((userCredential) => {
        // Signed in
        console.log(userCredential);
        setOpenLogin(false);
        // setShowSpinner(false)
      })
      .catch((error) => {
        // setErrorMessage(`${error.code} ${error.message}`)
        // setShowErrorMessage(true)
        // setShowSpinner(false)
      })
  }

  const signOut = () => {
    auth.signOut()
  }

  const setCurrentUser = (payload) => {
    dispatch({
      type:"SET_CURRENT_USER",
      payload
    })
  };

  const setCharacterInfo = (payload) => {
    dispatch({
      type:"SET_CHARACTER_INFO",
      payload
    })
  };
  
  const getBackgrounds = () => {
    console.log(database);
    console.log(auth);
    const db = database;
    let backgrounds = [];
    getDocs(collection(db, "backgrounds")).then(querySnapshot => {
        querySnapshot.forEach((doc) => {
          console.log(doc.data());
            const data = doc.data();
            backgrounds.push(data);
        });
        dispatch({
          type: "SET_BACKGROUNDS",
          payload: backgrounds,
        });
    });
  };

  const getDamageTable = () => {
    const db = database;
    const docRef = doc(db, "util", "damageTable");
    let damageTable = {};
    getDoc(docRef).then(snapshot=> {
      damageTable = snapshot.data();
      dispatch({
        type: "SET_DAMAGE_TABLE",
        payload: damageTable
      })
    })
    
  }

  return {
    logIn,
    signOut,
    setCharacterInfo,
    getBackgrounds,
    getDamageTable,
    setCurrentUser
  };
};
