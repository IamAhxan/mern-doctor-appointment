// Corrected Usage
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./src/Pages/AppLayout";
import App from "./src/App";
import Login from "./src/Pages/Login";
import Dashboard from "./src/Pages/Admin/Dashboard";
import AllAppointments from "./src/Pages/Admin/AllAppointments";
import AddDoctor from "./src/Pages/Admin/AddDoctor";
import DoctorList from "./src/Pages/Admin/DoctorList";
import DoctorDashboard from "./src/Pages/Doctor/DoctorDashboard";

const routes = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            {
                path: "/",
                element: <App />,
                children: [
                    {
                        path: '/',
                        element: <></>
                    },
                    {
                        path: '/admin-dashboard',
                        element: <Dashboard />
                    },
                    {
                        path: '/all-appointments',
                        element: <AllAppointments />
                    },
                    {
                        path: '/add-doctor',
                        element: <AddDoctor />
                    },
                    {
                        path: '/doctor-list',
                        element: <DoctorList />
                    },
                ]
            },
        ]
    },
    {
        path: '/test',
        element: <h1>TEst</h1>
    },
    {
        path: "/login",
        element: <Login />,
    }
]);

export default routes;