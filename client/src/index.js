import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

ReactDOM.render(
  <React.StrictMode>
    <ReactNotifications />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
