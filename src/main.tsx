import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css"; 
import Header from "./components/Header";

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Header/>
      <App />
    </React.StrictMode>
  );
}
