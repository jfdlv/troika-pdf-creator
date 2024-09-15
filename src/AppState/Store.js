import React, {useEffect} from 'react'
import { getAuth } from 'firebase/auth'
import { useActions} from './Actions';
export const Store = React.createContext();

const initialState = {
    characterInfo: {},
    backgrounds: [],
    damageTable: {},
    currentUser: {}
};

function reducer(state, action) {
    switch (action.type) {
        case 'SET_CURRENT_USER':
            return { ...state, currentUser: action.payload}
        case 'SET_BACKGROUNDS': 
            return {...state, backgrounds: action.payload};
        case 'SET_DAMAGE_TABLE':
            return {...state, damageTable: action.payload}
        case 'SET_CHARACTER_INFO':
            return { ...state, characterInfo: action.payload };
        default:
            return state;
    }
}

export function StoreProvider(props) {

    const [state, dispatch] = React.useReducer( reducer, initialState );
    const actions = useActions( state, dispatch );
    const value = { state, dispatch, actions };

    useEffect(() => {
        const auth = getAuth()
        auth.onAuthStateChanged((firebaseUser) => {
          if (!firebaseUser) {
            actions.setCurrentUser(null)
            // eslint-disable-next-line no-console
            console.log('User is not logged in')
          } else {
            console.log(firebaseUser.email);
            actions.setCurrentUser(firebaseUser);
          }
        })
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

    return <Store.Provider value={value}>{props.children}
    </Store.Provider>
}