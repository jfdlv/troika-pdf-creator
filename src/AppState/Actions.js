import { doc, collection, getDocs, getDoc, addDoc } from "firebase/firestore"; 
import {database,auth} from "../config/firebase";
import {signInWithEmailAndPassword, createUserWithEmailAndPassword} from 'firebase/auth';

export const useActions = (state, dispatch) => {

  const logIn = (
    credentials,
    { setShowSpinner, setErrorMessage },
    {setOpenLogin}
  ) => {
    signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password,
    )
      .then((userCredential) => {
        // Signed in
        setOpenLogin(false);
        setShowSpinner(false);
        setErrorMessage('');
      })
      .catch((error) => {
        if(error.code === "auth/wrong-password") {
          setErrorMessage("INVALID PASSWORD")
        }
        else {
          setErrorMessage(`${error.code} ${error.message}`);
        }
        setShowSpinner(false);
      })
  }

  const register = (
    credentials,
    { setShowSpinner, setErrorMessage },
    {setOpenRegister}
  ) => {
    createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password,
    )
      .then((userCredential) => {
        // Signed in
        setOpenRegister(false);
        setShowSpinner(false);
        setErrorMessage('');
      })
      .catch((error) => {
        if(error.code === 'auth/email-already-in-use') {
          setErrorMessage("EMAIL ALREADY IN USE");
        } else if (error.code === 'auth/weak-password') {
          setErrorMessage('PASSWORD IS TOO WEAK');
        }
        else {
          setErrorMessage(`${error.code} ${error.message}`);
        }
        setShowSpinner(false);
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

  const addCharacter = async ({setShowSpinner, setErrorMessage, goToCharacters}) => {
    // setShowSpinner(true);
    const db = database;
    const charactersRef = collection(db, "userCharacters", state.currentUser.uid, "characters");
    try {
      // Add a new document to the 'orders' subcollection
      setShowSpinner(true);
      goToCharacters();
      const docRef = await addDoc(charactersRef, {...state.characterInfo});
  
      setErrorMessage('Order added with ID: ', docRef.id);
    } catch (error) {
      setErrorMessage('Error adding order: ', error);
    } finally {
      setShowSpinner(false);
    }
  }

  return {
    logIn,
    register,
    signOut,
    setCharacterInfo,
    getBackgrounds,
    getDamageTable,
    setCurrentUser,
    addCharacter
  };
};
