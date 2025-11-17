import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import {store, persistor} from "./redux/store.js";
import {PersistGate} from 'redux-persist/integration/react';

import {MsalProvider} from "@azure/msal-react";
import { msalInstance } from "./services/utilities/msalInstance.js";

createRoot(document.getElementById("root")).render(
  <Router>
    <StrictMode>
      <MsalProvider instance={msalInstance}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
 <App />
        </PersistGate>
     
      </Provider>
      </MsalProvider>
    </StrictMode>
  </Router>
);
