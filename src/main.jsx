import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import { MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { BrowserRouter } from "react-router-dom";
import "./i18n.js";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/charts/styles.css";
import store from "./store";
import Provider from "react-redux/es/components/Provider";

const theme = createTheme({
  primaryColor: "indigo",
  // fontFamily: 'sans-serif',
  fontFamily: "Open Sans, sans-serif",
  // autoContrast: true,
  // defaultRadius: 'xl'
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <Notifications />
      <BrowserRouter>
          <Provider store={store}>
              <App />
          </Provider>
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>
);
