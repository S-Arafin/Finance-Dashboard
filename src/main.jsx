import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider } from "react-router";
import router from "./routes/router.jsx";
import { ThemeProvider } from "./Provider/ThemeProvider.jsx";
import { DataProvider } from "./Provider/DataProvider.jsx";
import { AuthProvider } from "./Provider/AuthProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
        <RouterProvider router={router}></RouterProvider>
      </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
