import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css';
import ChatProvider from './context/ChatProvider.js';
// import {
//   ChakraProvider,
// } from "@chakra-ui/react";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(


  <BrowserRouter >
    <ChatProvider>

      <App />
    </ChatProvider>
  </BrowserRouter >


);

