import { createBrowserRouter } from "react-router";
import mainLayout from "../Layouts/mainLayout";
import ErrorPage from "../Error/ErrorPage";
import summary from "../pages/summary";
import Statement from "../pages/Statement";
import Income from "../pages/Income";
import Expenses from "../pages/Expenses";
import User from "../pages/User";

const router = createBrowserRouter(
    [
        {
            path:'/',
            Component: mainLayout,
            errorElement: <ErrorPage/>,
            children: [
                {
                    path: '/',
                    Component: summary,
                },
                {
                    path: '/statement',
                    Component: Statement
                },
                {
                    path: '/income',
                    Component: Income,
                },
                {
                    path: '/expenses',
                    Component: Expenses,
                },
                {
                    path: '/user',
                    Component: User,
                },
                
            ]
            
        }
    ]
)

export default router;