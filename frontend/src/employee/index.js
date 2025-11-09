// src/index.js
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import "./src/overrides.css"; // خليه آخر CSS عشان يكسر أي تضارب

import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App /> {/* الهيدر والسايدبار جوّا App/Layouts، مش هون */}
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
