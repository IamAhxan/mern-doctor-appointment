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
import DoctorAppointments from "./src/Pages/Doctor/DoctorAppointments";
import DoctorProfile from "./src/Pages/Doctor/DoctorProfile";

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
                    {
                        path: '/doctor-dashboard',
                        element: <DoctorDashboard />
                    },
                    {
                        path: '/doctor-appointments',
                        element: <DoctorAppointments />
                    },
                    {
                        path: '/doctor-profile',
                        element: <DoctorProfile />
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