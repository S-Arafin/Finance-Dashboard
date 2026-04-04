import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider } from "react-router";
import router from "./routes/router.jsx";
import { ThemeProvider } from "./Provider/ThemeProvider.jsx";
import { DataProvider } from "./Provider/DataProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <DataProvider>
        <RouterProvider router={router}></RouterProvider>
      </DataProvider>
    </ThemeProvider>
  </StrictMode>,
);
