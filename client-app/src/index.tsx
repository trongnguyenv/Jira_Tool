import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/layout/App';
import { store, StoreContext } from './app/stores/store';
import 'react-datepicker/dist/react-datepicker.css';
import { BrowserRouter } from 'react-router-dom';
import './darkmode.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StoreContext.Provider value={store}>
    <BrowserRouter >
      <App />
    </ BrowserRouter>
  </StoreContext.Provider>
);

