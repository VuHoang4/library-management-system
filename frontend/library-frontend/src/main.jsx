import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import SearchProvider from "./context/SearchProvider";
import AuthProvider from "./context/AuthProvider.jsx";  
import ToastProvider  from "./context/ToastProvider.jsx";

import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>       
        <SearchProvider>
           <ToastProvider>  
          <App />
        </ToastProvider>
        </SearchProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);