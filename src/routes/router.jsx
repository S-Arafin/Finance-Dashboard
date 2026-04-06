import { createBrowserRouter } from "react-router";
import MainLayout from "../Layouts/mainLayout";
import ErrorPage from "../Error/ErrorPage";
import Summary from "../pages/Summary";
import Statement from "../pages/Statement";
import Income from "../pages/Income";
import Expenses from "../pages/Expenses";
import User from "../pages/User";
import Login from "../pages/Login";


const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: MainLayout,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        Component: Summary,
      },
      {
        path: "/statement",
        Component: Statement,
      },
      {
        path: "/income",
        Component: Income,
      },
      {
        path: "/expenses",
        Component: Expenses,
      },
      {
        path: "/user",
        Component: User,
      },
      {
        path: "*",
        Component: ErrorPage,
      },
    ],
  },
  {
    path: "*",
    Component: ErrorPage,
  },
]);

export default router;
