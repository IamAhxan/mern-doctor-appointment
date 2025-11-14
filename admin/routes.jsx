// Corrected Usage
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./src/Pages/AppLayout";
import App from "./src/App";

const routes = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            {
                path: "/",
                element: <App />,
            }
        ]
    }
]);

export default routes;