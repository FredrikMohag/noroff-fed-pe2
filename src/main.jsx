import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux"; // <-- Importera Provider från react-redux
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import store from "./store.js";
import './styles/global.scss';

const rootElement = document.getElementById("root");

ReactDOM.createRoot(rootElement).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
