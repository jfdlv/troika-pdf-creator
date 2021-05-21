import React from 'react'

export const Store = React.createContext();

const initialState = {
    characterInfo: {}
};

function reducer(state, action) {
    switch (action.type) {
        case 'SET_CHARACTER_INFO':
            return { ...state, characterInfo: action.payload };
        default:
            return state;
    }
}

export function StoreProvider(props) {

    const [state, dispatch] = React.useReducer(reducer, initialState);
    const value = { state, dispatch };

    return <Store.Provider value={value}>{props.children}
    </Store.Provider>
}