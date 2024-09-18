import React from "react";
import ReactDOM from "react-dom/client"; // Use 'react-dom/client' for React 18
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const root = ReactDOM.createRoot(document.getElementById("root")); // Create root
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

