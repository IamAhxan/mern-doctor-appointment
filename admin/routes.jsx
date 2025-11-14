// Corrected Usage
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./src/Pages/AppLayout";
import App from "./src/App";
import Login from "./src/Pages/Login";

const routes = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            {
                path: "/",
                element: <App />,
            },
            {
                path: "/login",
                element: <Login />,
            },
        ]
    }
]);

export default routes;