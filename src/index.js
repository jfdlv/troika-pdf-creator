import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import './index.scss';
import App from './App';
// import * as serviceWorker from './serviceWorker';
import { StoreProvider } from '../src/AppState/Store';

import {
  BrowserRouter
} from "react-router-dom";

const container = document.getElementById('root');

// Create a root.
const root = ReactDOMClient.createRoot(container);

root.render(
  <BrowserRouter>
    <StoreProvider>
      <App />
    </StoreProvider>
  </BrowserRouter>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
